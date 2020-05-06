import U5Session from './U5Session';

/* global localStorage */

/** Provides access to previous, new, and test U5Sessions */
export default class U5SessionFactory {
  getIDList = () => {
    let ids = localStorage.getItem('U5SessionIDList');
    if (!ids) {
      ids = [];
    } else {
      ids = ids.split(',');
    }

    // filter out unsaved sessions
    ids = ids.filter(id => !!localStorage.getItem(id));
    return ids;
  }

  get = id => {
    const json = JSON.parse(localStorage.getItem(id));
    const session = U5Session.thaw(json);

    // Reorder sessions to make this session the most recent
    let ids = this.getIDList();
    ids = ids.filter(item => item !== id);
    ids.push(id);
    this._setIDList(ids);

    return session;
  }

  remove = id => {
    let ids = this.getIDList();
    ids = ids.filter(item => item !== id);
    this._setIDList(ids);
    return ids;
  }

  last = () => {
    const ids = this.getIDList();
    const id = ids.pop();

    if (!id) {
      return this.newSession();
    }

    const json = JSON.parse(localStorage.getItem(id));
    const session = U5Session.thaw(json);

    return session;
  }

  newSession = () => {
    const id = this._getNextID();

    const ids = this.getIDList();
    ids.push(id);
    this._setIDList(ids);

    const session = U5Session.create(id);
    return session;
  }

  test = () => {
    const id = this._getNextID();

    const ids = this.getIDList();
    ids.push(id);
    this._setIDList(ids);

    // Always get the same data, but save to new id
    const test = localStorage.getItem('U5SessionTestData');

    test.id = id;
    const session = U5Session.thaw(test);
    return session;
  }

  _setIDList = ids => localStorage.setItem('U5SessionIDList', ids)

  _getNextID = () => {
    let currentID = localStorage.getItem('U5SessionIDCount');
    if (!currentID) {
      currentID = 0;
    }
    currentID = parseInt(currentID, 10) + 1;
    localStorage.setItem('U5SessionIDCount', currentID);
    return `U5Session_${currentID}`;
  }
}
