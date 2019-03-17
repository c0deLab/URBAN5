import parseText from '../helpers/TextToConstraint';

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
    if (this.type === 'Structure') {
      objectsOfType = design.getBuildings();
    } else {
      const objects = design.getObjects();
      objectsOfType = objects.filter(item => parseInt(this.type) === item.type);
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

  isSameType = otherConstraint => {
    return otherConstraint.fn === this.fn
      && JSON.stringify(otherConstraint.type) === JSON.stringify(this.type)
      && otherConstraint.prop === this.prop;
  }
}

const getError = constraintData => {
  if (!constraintData) {
    return 'There was an error';
  }

  const { fn, type, prop, value } = constraintData;
  if (!fn) {
    return 'Ted, it is not clear what you want to test';
  }
  if (!type) {
    return 'Ted, what type of object is this constraint for?';
  }
  if (!prop) {
    return 'Ted, what object property is this constraint for?';
  }
  if (!value) {
    return 'Ted, what value is this constraint using?';
  }
  return null;
};

Constraint.create = text => {
  if (!text) {
    return 'No text provided';
  }

  const constraintData = parseText(text);
  const error = getError(constraintData);
  if (error === null) {
    return new Constraint(constraintData);
  }
  console.log(`Bad Constraint: ${JSON.stringify(constraintData)}`);
  return error;
};

export default Constraint;
