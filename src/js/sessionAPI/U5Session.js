import Monitor from './Monitor';
import Design from './Design';
import Topo from './Topo';

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
    const t0 = new Date().getTime();
    // calculate totals
    this._design.calculateAttributes(this.topo);
    const t1 = new Date().getTime();

    // monitor checks design
    this._monitor.checkConflicts(this._design);
    const t2 = new Date().getTime();

    // save
    this.save();
    const t3 = new Date().getTime();

    console.log(t1 - t0, t2 - t1, t3 - t2);
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
    // Get the 3D array of objects
    getAll: () => this._design.getAll(),
    // Get the 2D array of objects for a given slice
    getSlice: (camera, slice) => this._design.getSlice(camera, slice),
    getBackgroundSlices: (camera, slice) => this._design.getBackgroundSlices(camera, slice)
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
    getSlice: (camera, slice) => this._topo.getSlice(camera, slice)
  };

  // Interface for the monitor
  monitor = {
    addConstraint: text => {
      this._monitor.addConstraint(text);
      this.onUpdate();
    },
    getMessages: () => this._monitor.getMessages()
  };

  save = () => {
    // console.log('save!');
    const ice = U5Session.freeze(this);
    localStorage.setItem(this._id, JSON.stringify(ice));
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
  const { id, design, topo, monitor } = json;  // eslint-disable-line
  const session = new U5Session(id);
  session._design = Design.thaw(design);  // eslint-disable-line
  session._topo = Topo.thaw(topo);  // eslint-disable-line
  session._monitor = Monitor.thaw(monitor);  // eslint-disable-line

  session.onUpdate();

  return session;
};

export default U5Session;
