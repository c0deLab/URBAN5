/* Class to handle getting a universal ID */
export default class ID {
  constructor() {
    this.nextId = -1;
  }

  getNextID = () => {
    this.nextId += 1;
    return this.nextId;
  }
}
