import ObjectsEnum from '../enums/ObjectsEnum';

class Constraint {
  constructor(data) {
    if (data) {
      const { text, result, fn, type, prop, comp, value } = data;  // eslint-disable-line
      this.text = text;
      this.result = result;
      this.fn = fn;
      this.type = type;
      this.prop = prop;
      this.comp = comp;
      this.value = value;
    }
  }

  isViolated = design => {
    let objectsOfType;
    if (this.type === 'building') {
      objectsOfType = design.getBuildings();
    } else {
      const objects = design.getObjects();
      objectsOfType = objects.filter(item => this.type.includes(item.type));
      objectsOfType = objectsOfType.map(item => item.object);
    }

    const propValues = objectsOfType.map(item => item[this.prop]);

    if (propValues.length === 0) {
      return false;
    }

    let calculatedValue = null;
    switch (this.fn) {
      case 'SUM':
        calculatedValue = propValues.reduce((sum, num) => num ? (sum + num) : sum);  // eslint-disable-line
        break;
      case 'MAX':
        calculatedValue = propValues.reduce((max, num) => num ? Math.max(max, num) : max);  // eslint-disable-line
        break;
      case 'MIN':
        calculatedValue = propValues.reduce((min, num) => num ? Math.min(min, num) : min);  // eslint-disable-line
        break;
      default:
        break;
    }

    const calculatedResult = eval(`${calculatedValue} ${this.comp} ${this.value}`);  // eslint-disable-line
    console.log(this.prop, calculatedValue, this.comp, this.value, calculatedResult, 'expected', this.result);
    const isViolated = calculatedResult !== this.result;

    return isViolated;
  }
}

const no = ['no', 'not'];
const max = ['any', 'no'];
const sum = ['total', 'all'];
const building = ['building', 'structure'];
const cube = ['cube', 'room'];
const roof = ['roof'];
const tree = ['tree'];
const area = ['area', 'square footage', 'space', 'floorspace', 'size'];
const height = ['tall', 'height', 'elevation'];
const ground = ['ground'];
const gt = ['greater than', 'more than'];
const lt = ['fewer than', 'less than'];

const matchNumber = new RegExp(/[0-9]+/g);

const textHas = (text, test) => {
  let hasMatch = false;
  test.forEach(str => {
    hasMatch = hasMatch || text.includes(str);
  });
  return hasMatch;
};

Constraint.parseText = text => {
  let result = true;
  if (textHas(text, no)) {
    result = false;
  }

  let fn = 'SUM';
  if (textHas(text, max)) {
    fn = 'MAX';
  } else if (textHas(text, sum)) {
    fn = 'SUM';
  }

  let type = [];
  if (textHas(text, building)) {
    type = 'building';
  } else {
    if (textHas(text, cube)) {
      type.push(ObjectsEnum.CUBE);
    }
    if (textHas(text, roof)) {
      type.push(ObjectsEnum.CUBE);
    }
    if (textHas(text, tree)) {
      type.push(ObjectsEnum.FOLIAGE);
      type.push(ObjectsEnum.TRUNK);
    }
  }
  // Default to building structure
  if (type.length === 0) {
    type = [ObjectsEnum.CUBE, ObjectsEnum.ROOF];
  }

  let prop = null;
  if (textHas(text, area)) {
    prop = 'area';
  } else if (textHas(text, height)) {
    prop = 'height';
  } else if (textHas(text, ground)) {
    prop = 'ground';
  }

  let comp = '===';
  if (textHas(text, gt)) {
    comp = '>';
  } else if (textHas(text, lt)) {
    comp = '<';
  }

  const numbers = text.match(matchNumber);
  let value;
  if (numbers && numbers.length > 0) {
    [value] = numbers;
  }

  const constraintData = { text, result, fn, type, prop, comp, value }; // eslint-disable-line
  // const constraintData = {
  //   result: true,
  //   fn: 'SUM',
  //   type: [ObjectsEnum.CUBE],
  //   prop: 'AREA',
  //   comp: '<',
  //   value: text
  // };

  console.log(JSON.stringify(constraintData));

  if (!fn) {
    return null;
  }
  if (type.length === 0) {
    return null;
  }
  if (!prop) {
    return null;
  }
  if (!value) {
    return null;
  }
  return constraintData;
};

Constraint.create = text => {
  if (!text) {
    return null;
  }

  const constraintData = Constraint.parseText(text.toLowerCase());
  if (!constraintData) {
    return null;
  }

  return new Constraint(constraintData);
};

export default Constraint;
