import Monitor from './Monitor';
import Design from './Design';
import Topo from './Topo';
import beep from '../helpers/Sounds';

/* global localStorage */

/**
* Represents a user's session with the system and provides an interface for
* the UI to display information about it.
*/
class U5Session {
  constructor(id) {
    this._id = id;
  }

  onUpdate = () => {
    // calculate totals
    this._design.calculateAttributes(this.topo);

    // monitor checks design
    const newProblems = this._monitor.checkDesign(this._design);
    if (newProblems) {
      beep();
    }

    // save
    this.save();
  };

  clear = () => {
    this._design.clear();
    this._topo.clear();
    this._monitor.clearConstraints();
    this.onUpdate();
  };

  // Interface for the design model
  design = {
    add: (type, xyz, meta) => {
      this._design.add(type, xyz, meta);
      this.onUpdate();
    },
    remove: xyz => {
      this._design.remove(xyz);
      this.onUpdate();
    },
    setSurface: (camera, xyz, side, surface) => {
      this._design.setSurface(camera, xyz, side, surface);
      this.onUpdate();
    },
    // Get the 3D array of design
    getAll: () => this._design.getAll(),
    getAt: p => this._design.getAt(p),
    // Get array of objects
    getObjects: () => this._design.getObjects(),
    // Get the 2D array of objects for a given slice
    getSlice: (camera, slice) => this._design.getSlice(camera, slice),
    getBackgroundSlices: (camera, slice, max) => this._design.getBackgroundSlices(camera, slice, max)
  };

  // Interface for the topography model
  topo = {
    // Increase the height of the topography at position xy by 1
    increase: xy => {
      this._topo.increase(xy);
      this.onUpdate();
    },
    // Decrease the height of the topography at position xy by 1
    decrease: xy => {
      this._topo.decrease(xy);
      this.onUpdate();
    },
    // Get the 2D array of heights for the topography
    getCorners: () => this._topo.getCorners(),
    // Get the 2D array of heights for the topography
    getAt: xy => this._topo.getAt(xy),
    // Get a list of heights for the topography at the corners for a line representing it in a slice
    getSlice: (camera, slice) => this._topo.getSlice(camera, slice),
    getBackgroundSlices: (camera, slice, max) => this._topo.getBackgroundSlices(camera, slice, max)
  };

  // Interface for the monitor
  monitor = {
    addConstraint: text => {
      const success = this._monitor.addConstraint(text);
      if (success) {
        this.onUpdate();
      }
    },
    clearConstraints: () => {
      this._monitor.clearConstraints();
      this.onUpdate();
    },
    getMessages: () => this._monitor.getMessages()
  };

  save = () => {
    // console.log('save!');
    const ice = U5Session.freeze(this);
    localStorage.setItem(this._id, JSON.stringify(ice));
    localStorage.setItem(`${this._id}_date`, Date.now());
  };
}

U5Session.create = id => {
  const session = new U5Session(id);
  session._design = new Design();  // eslint-disable-line
  session._topo = new Topo();  // eslint-disable-line
  session._monitor = new Monitor();  // eslint-disable-line

  session.save();
  return session;
};

U5Session.freeze = session => {
  const { _id, _design, _topo, _monitor } = session;  // eslint-disable-line

  const json = {
    id: _id,
    design: Design.freeze(_design),
    topo: Topo.freeze(_topo),
    monitor: Monitor.freeze(_monitor)
  };

  return json;
};

U5Session.thaw = json => {
  const { id, design, topo, monitor, date } = json;  // eslint-disable-line
  const session = new U5Session(id);
  session._design = Design.thaw(design);  // eslint-disable-line
  session._topo = Topo.thaw(topo);  // eslint-disable-line
  session._monitor = Monitor.thaw(monitor);  // eslint-disable-line

  session.onUpdate();

  return session;
};

export default U5Session;
