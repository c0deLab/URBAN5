import Constraint from './Constraint';

/* global SETTINGS */

/** Class to monitor the actions of the user */
class Monitor {
  constructor() {
    this.constraints = [];
    this.systemConstraints = [
      new Constraint({
        text: 'no object below ground',
        result: false,
        fn: 'MIN',
        type: 'Any',
        prop: 'ground',
        comp: '<',
        value: '0'
      }),
      new Constraint({
        text: 'no roof without base',
        result: false,
        fn: 'SUM',
        type: 1,
        prop: 'noBase',
        comp: '>',
        value: '0' // the height of top of the building
      }),
      new Constraint({
        text: 'no building floating',
        result: false,
        fn: 'SUM',
        type: 'Structure',
        prop: 'floating',
        comp: '>',
        value: '0' // the height of top of the building
      }),
      new Constraint({
        text: 'no tree floating',
        result: false,
        fn: 'MIN',
        type: 2,
        prop: 'ground',
        comp: '>',
        value: '0' // the height of top of the building
      }),
    ];
    this.conflicts = [];
    this.incompatibilities = [];
    this.messages = [];
  }

  getMessages = () => this.messages;

  setMessages = messages => this.messages = messages;

  addConstraint = text => {
    const constraintToAdd = Constraint.create(text);
    this.messages.push(text);

    if (constraintToAdd && constraintToAdd instanceof Constraint) {
      // Check if this overrides former constraint
      const newConstraints = [];
      let removedConstraint = null;
      this.constraints.forEach(old => {
        if (!old.isSameType(constraintToAdd)) {
          newConstraints.push(old);
        } else {
          removedConstraint = old;
        }
      });
      // If remove flag is set, it will cancel out the old, and we don't want to add
      if (!constraintToAdd.removeFlag) {
        newConstraints.push(constraintToAdd);
        this.messages.push(`I have understood. The constraint: '${constraintToAdd.text}' was added.`);
      } else if (removedConstraint) {
        // remove constraint removed something
        this.messages.push(`Removed the constraint: '${removedConstraint.text}'`);
      }

      this.constraints = newConstraints;
      return true;
    }

    this.messages.push('I am sorry I do not understand.');
    return false;
  };

  clearConstraints = () => {
    this.constraints = [];
    this.messages.push('Cleared constraints');
  }

  checkDesign = design => {
    const conflicts = this.checkConflicts(design);
    const incompatibilities = this.checkIncompatibilities(design);

    const newMessages = [];
    if (conflicts.length > 2) {
      newMessages.push(`Don't you think you should stop, ${SETTINGS.userName}?`);
    } else if (conflicts.length > 1) {
      newMessages.push(`${SETTINGS.userName}, many conflicts are occurring.`);
    } else if (conflicts.length > 0) {
      // conflicts.forEach(conflict => {
      //   newMessages.push(`Ted, a conflict has occurred, you said: ${conflict.constraint.text}. The present status is ${conflict.value}.`);
      // });
      newMessages.push(`${SETTINGS.userName}, a conflict has occurred, you said: ${conflicts[0].constraint.text}. The present status is ${conflicts[0].value}.`);
    } else if (conflicts.length === 0 && this.conflicts.length > 0) {
      newMessages.push('Conflicts were resolved.');
    }

    if (incompatibilities.length > 0) {
      newMessages.push('Not structurally possible at this time.');
    } else if (incompatibilities.length === 0 && this.incompatibilities.length > 0) {
      newMessages.push('Incompatibilities were resolved.');
    }

    console.log(`Messages: [${newMessages.join(',')}]`);
    this.messages = newMessages;

    let newProblems = false;
    if (conflicts.length > this.conflicts.length || incompatibilities.length > this.incompatibilities.length) {
      newProblems = true;
    }

    this.conflicts = conflicts;
    this.incompatibilities = incompatibilities;

    return newProblems;
  }

  /**
    * Conflict “An inconsistency discerned by the machine relating criteria specified by the designer
    * to forms generated by the designer.”
    * Examples: max height, number of objects, light, blocking entrances, check access
    */
  checkConflicts = design => {
    const conflicts = [];
    this.constraints.forEach(constraint => {
      if (constraint.isViolated(design).result) {
        console.log('violated constraint!');
        conflicts.push({ constraint, value: constraint.isViolated(design).value });
      }
    });

    return conflicts;
  };

  /**
    * Incompatibility: “incongruity between a designer’s action and a predefined requisite embedded in the machine.”
    * Leads to a bell ringing and displaying the message on the top of the screen
    * Examples: underground, floating, clash
    */
  checkIncompatibilities = design => {
    const incompatibilities = [];
    this.systemConstraints.forEach(constraint => {
      if (constraint.isViolated(design).result) {
        console.log('violated system constraint!');
        incompatibilities.push({ constraint, value: constraint.isViolated(design).value });
      }
    });

    return incompatibilities;
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
