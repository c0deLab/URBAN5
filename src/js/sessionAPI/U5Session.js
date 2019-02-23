import Monitor from './Monitor';
import Design from './Design';
import Topo from './Topo';

/* global localStorage */

/** Represents a user's session with the system and provides an interface for the UI to display information about it. */
class U5Session {
  constructor(id) {
    this._id = id;

  }

  onUpdate = () => {
    // save
    localStorage.setItem(`U5Session${this._id}`, U5Session.freeze(this));

    // monitor checks design
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
}

U5Session.create = id => {
  const session = new U5Session(id);
  session._design = new Design();
  session._topo = new Topo();
  session._monitor = new Monitor();

  return session;
};

U5Session.freeze = session => {
  const { _id, _design, _topo, _monitor } = session;

  const json = {
    id: _id,
    design: Design.freeze(_design),
    topo: Topo.freeze(_topo),
    monitor: Monitor.freeze(_monitor)
  };

  return json;
};

U5Session.thaw = json => {
  const { id, design, topo, monitor } = json;
  const session = new U5Session(id);
  session._design = Design.thaw(design);
  session._topo = Topo.thaw(topo);
  session._monitor = Monitor.thaw(monitor);

  return session;
};

export default U5Session;
