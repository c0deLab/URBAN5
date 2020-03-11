import parseText from '../helpers/TextToConstraint';

class Constraint {
  constructor(data) {
    if (data) {
      const { text, result, fn, type, prop, comp, value, removeFlag } = data;  // eslint-disable-line
      this.text = text;
      this.result = result;
      this.fn = fn;
      this.type = type;
      this.prop = prop;
      this.comp = comp;
      this.value = value;
      this.removeFlag = removeFlag;
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

    return {
      result: isViolated,
      value: calculatedValue
    };
  }

  isSameType = otherConstraint => {
    return JSON.stringify(otherConstraint.type) === JSON.stringify(this.type)
      && otherConstraint.prop === this.prop;
  }
}

const possibleConstraints = [
  { fn: 'MAX', type: 'Structure', prop: 'height' }, // can compare the max structure height to anything
  { fn: 'MIN', type: 'Structure', prop: 'height' }, // can compare the min structure height to anything
  { fn: 'MAX', type: '0', prop: 'distToAccess' }, // can compare to dist to access for cubes
  { fn: 'MAX', type: 'Structure', prop: 'area' }, // can compare the max structure area to anything
  { fn: 'MIN', type: 'Structure', prop: 'area' }, // can compare the min structure area to anything
];

const hasError = constraintData => {
  if (!constraintData) {
    return true;
  }

  const { fn, type, prop, value, comp, result, removeFlag } = constraintData;
  // If remove flag is set, try to cancel one out
  if (removeFlag) {
    return false;
  }

  if (!fn || !type || !prop || !value || !comp || result === null) {
    return true;
  }

  let hasMatch = false;
  // Check if they match a possible constraint
  possibleConstraints.forEach(possibility => {
    if ((possibility.fn === undefined || possibility.fn === fn)
        && (possibility.type === undefined || possibility.type === type)
        && (possibility.prop === undefined || possibility.prop === prop)
        && (possibility.value === undefined || possibility.value === value)
        && (possibility.comp === undefined || possibility.comp === comp)
        && (possibility.result === undefined || possibility.result === result)) {
      hasMatch = true; // if they match all the provided criteria
    }
  });
  if (!hasMatch) {
    return true;
  }
  return false;
};

Constraint.create = text => {
  if (!text) {
    return 'No text provided';
  }

  const constraintData = parseText(text);
  if (!hasError(constraintData)) {
    return new Constraint(constraintData);
  }

  return null;
};

export default Constraint;
