import Constraint from './Constraint';

/** Class to monitor the actions of the user */
class Monitor {
  constructor() {
    this.constraints = [];
    this.systemConstraints = [
      new Constraint({
        text: 'no building below ground',
        result: false,
        fn: 'MIN',
        type: 'building',
        prop: 'ground',
        comp: '<',
        value: '0'
      }),
      new Constraint({
        text: 'no roof without base',
        result: false,
        fn: 'SUM',
        type: [1],
        prop: 'noBase',
        comp: '>',
        value: '0' // the height of top of the building
      }),
      new Constraint({
        text: 'no building floating',
        result: false,
        fn: 'SUM',
        type: 'building',
        prop: 'floating',
        comp: '>',
        value: '0' // the height of top of the building
      }),
    ];
    this.conflicts = [];
    this.incompatibilities = [];
    this.messages = [];
  }

  getMessages = () => this.messages;

  addConstraint = text => {
    const constraint = Constraint.create(text);
    if (constraint) {
      // Does this override former constraint?
      const newConstraints = [];
      this.constraints.forEach(old => {
        if (!old.isSameConstraintType(constraint)) {
          newConstraints.push(old);
        }
      });
      newConstraints.push(constraint);

      this.constraints = newConstraints;
      this.messages = [`Added constraint: ${JSON.stringify(constraint)}`];
      return true;
    }
    return false;
  };

  /**
    * Conflict “An inconsistency discerned by the machine relating criteria specified by the designer
    * to forms generated by the designer.”
    * Examples: max height, number of objects, light, blocking entrances, check access
    */
  checkConflicts = design => {
    this.messages = [];
    const conflicts = [];
    this.constraints.forEach(constraint => {
      if (constraint.isViolated(design)) {
        console.log('violated constraint!');
        conflicts.push({ constraint });
      }
    });

    this.systemConstraints.forEach(constraint => {
      if (constraint.isViolated(design)) {
        console.log('violated system constraint!');
        conflicts.push({ constraint });
      }
    });

    if (conflicts.length > 3) {
      this.messages = ['Ted, many conflicts are occurring.'];
    } else if (conflicts.length > 0) {
      const messages = [];
      conflicts.forEach(conflict => {
        messages.push(`Violated constraint: ${conflict.constraint.text}`);
      });
      this.messages = messages;
    }
  };

  /**
    * Incompatibility: “incongruity between a designer’s action and a predefined requisite embedded in the machine.”
    * Leads to a bell ringing and displaying the message on the top of the screen
    * Examples: underground, floating, clash
    */
  checkIncompatibilities = actionEvent => {

  };
}

Monitor.freeze = monitor => {
  const jsonStr = JSON.stringify(monitor);
  const json = JSON.parse(jsonStr);

  return json;
};

Monitor.thaw = json => {
  const { constraints, conflicts, incompatibilities, messages } = json;

  const monitor = new Monitor();

  monitor.constraints = constraints.map(constraintData => new Constraint(constraintData));
  monitor.conflicts = conflicts;
  monitor.incompatibilities = incompatibilities;
  monitor.messages = messages;

  return monitor;
};

export default Monitor;
