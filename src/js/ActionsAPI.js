import ID from './ID';

/** Class for through which all user actions pass */
export default class ActionsAPI {
  constructor() {
    this.listeners = [];
    this.actionsHistory = [];
    this.ActionsID = new ID();
  }

  addListener = listener => this.listeners.push(listener);

  removeListener = toRemove => this.listeners.filter(listener => listener !== toRemove);

  onAction = (action, metadata) => {
    const id = `action_${this.ActionsID.getNextID()}`;
    const actionEvent = { id, action, metadata };
    this.actionsHistory.push(actionEvent);
    this.listeners.forEach(listener => {
      if (listener.onAction) {
        listener.onAction(actionEvent);
      }
    });
  }
}
