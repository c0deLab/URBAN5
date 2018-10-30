import ObjectsEnum from './ObjectsEnum';
import ViewsEnum from './ViewsEnum';

/**
 * Represents the data of a design world
 *
 * TOOO: when you add an object, join it with others. when you delete an object, delete its friends.
 */
export default class DesignModel {
  constructor(xMax, yMax, zMax) {
    this.xMax = xMax;
    this.yMax = yMax;
    this.zMax = zMax;

    // init empty world
    this.objects = this._initObjects();
    this.topo = this._initTopo();

    // add some things to it to start
    this._populate();

    // 3 3D arrays all referencing 17x7x17 objects
  }

  /**
   * Add an object at a certain position.
   * @param {object} position - 3D position in the form {x:x,y:y,z:z}
   * @param {int} object - int representing the ObjectsEnum object
   */
  addObject = (position, object) => {
    const i = this._getIndexFromPosition(position);
    this.objects[i] = object;
  };

  /**
   * Remove the object at a certain position
   * @param {object} position - 3D position in the form {x:x,y:y,z:z}
   */
  removeObject = position => {
    const i = this._getIndexFromPosition(position);
    this.objects[i] = null;
  };

  /**
   * Set the topography height at a given position
   * @param {object} position - 2D position in the form {x:x,z:z}
   * @param {int} height - The y value of the topo at the position
   */
  setTopoHeight = (position, height) => {
    this.topo[position.x][position.z] = height;
  };

  /**
   * Returns 2D array of objects in the given slice
   * @param {int} view - The ViewsEnum camera view
   * @param {int} slice - The current slice being viewed from that camera view
   */
  getSlice = (view, slice) => {
    const sliceObjects = this._getEmptySliceArray(view, slice);

    this.objects.forEach((object, i) => {
      const position = this._getPosition(i);

      switch (view) {
        case ViewsEnum.SOUTH:
          if (position.z === slice) {
            sliceObjects[position.x][position.y] = object;
          }
          break;
        case ViewsEnum.NORTH:
          if (position.z === (this.zMax - 1 - slice)) {
            sliceObjects[this.xMax-1-position.x][position.y] = object;
          }
          break;
        case ViewsEnum.WEST:
          if (position.x === slice) {
            sliceObjects[position.z][position.y] = object;
          }
          break;
        case ViewsEnum.EAST:
          if (position.x === (this.xMax - 1 - slice)) {
            sliceObjects[this.zMax-1-position.z][position.y] = object;
          }
          break;
        case ViewsEnum.BOTTOM:
          if (position.y === slice) {
            sliceObjects[position.x][this.zMax-1-position.z] = object;
          }
          break;
        case ViewsEnum.TOP:
          if (position.y === (this.yMax - 1 - slice)) {
            sliceObjects[position.x][position.z] = object;
          }
          break;
        default:
          throw new Error(`view ${view} is not recognized!`);
      }
    });

    return sliceObjects;
  };

  /**
   * Returns a union of all the slices behind the current slice from the current
   * camera view with respect to cubes.
   * @param {int} view - The ViewsEnum camera view
   * @param {int} slice - The current slice being viewed from that camera view
   */
  getBackgroundSlice = (view, slice) => {
    const sliceObjects = this._getEmptySliceArray(view, slice);

    this.objects.forEach((object, i) => {
      const position = this._getPosition(i);

      if (object === ObjectsEnum.CUBE) {
        switch (view) {
          case ViewsEnum.SOUTH:
            if (position.z > slice) {
              sliceObjects[position.x][position.y] = object;
            }
            break;
          case ViewsEnum.NORTH:
            if (position.z < (this.zMax - 1 - slice)) {
              sliceObjects[this.xMax - 1 - position.x][position.y] = object;
            }
            break;
          case ViewsEnum.WEST:
            if (position.x > slice) {
              sliceObjects[position.z][position.y] = object;
            }
            break;
          case ViewsEnum.EAST:
            if (position.x < (this.xMax - 1 - slice)) {
              sliceObjects[this.zMax-1-position.z][position.y] = object;
            }
            break;
          case ViewsEnum.BOTTOM:
            if (position.y > slice) {
              sliceObjects[position.x][this.zMax-1-position.z] = object;
            }
            break;
          case ViewsEnum.TOP:
            if (position.y < (this.yMax - 1 - slice)) {
              sliceObjects[position.x][position.z] = object;
            }
            break;
          default:
            throw new Error(`view ${view} is not recognized!`);
        }
      }
    });

    return sliceObjects;
  };

  /**
   * Returns the 3D position in the form {x:x,y:y,z:z} of the index i in a flattened array
   * @param {int} i - Index in flattened array
   */
  _getPosition = i => {
    const x = Math.floor(i/(this.zMax*this.yMax));
    const xRemainder = i % (this.zMax*this.yMax);
    const y = Math.floor(xRemainder/this.zMax);
    const z = i % this.zMax;

    return {x:x, y:y, z:z};
  };

  /**
   * Returns the index in a flattened version of a 3D array
   * @param {object} position - The 3D position in the form {x:x,y:y,z:z}
   */
  _getIndexFromPosition = position => (position.x * this.yMax * this.zMax) + (position.y * this.zMax) + position.z;

  /**
   * Returns an empty 2D array of the correct size for a slice from a given view
   * @param {int} view - The ViewsEnum camera view
   */
  _getEmptySliceArray = view => {
    let columns;
    let rows;

    switch (view) {
      case ViewsEnum.NORTH:
      case ViewsEnum.SOUTH:
        columns = this.xMax;
        rows = this.yMax;
        break;
      case ViewsEnum.WEST:
      case ViewsEnum.EAST:
        columns = this.zMax;
        rows = this.yMax;
        break;
      case ViewsEnum.TOP:
      case ViewsEnum.BOTTOM:
        columns = this.xMax;
        rows = this.zMax;
        break;
      default:
        throw new Error(`view ${view} is not recognized!`);
    }

    const sliceArr = this._getEmpty2DArray(rows, columns);
    return sliceArr;
  };

  /**
   * Returns an empty 2D array
   * @param {int} rows - Number of rows in the array
   * @param {int} columns - Number of columns in the array
   */
  _getEmpty2DArray = (rows, columns) => {
    const arr = new Array(columns);
    for (let i = 0; i < columns; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
  };

  /** Create an empty version of the design model */
  _initObjects = () => {
    let objects = new Array(this.xMax*this.yMax*this.zMax);

    for (let i = 0; i < objects.length; i++) {
      objects[i] = null;
    }

    return objects;
  };

  /** Create a flat topography */
  _initTopo = () => {
    let topo = new Array(this.xMax*this.zMax);

    for (let i = 0; i < topo.length; i++) {
      topo[i] = 0;
    }

    return topo;
  };

  /** Populates the design world with some objects */
  _populate = () => {
    // this.addObject({x:0, y:0, z:0}, ObjectsEnum.CUBE);
    // this.addObject({x:16, y:0, z:0}, ObjectsEnum.CUBE);
    // this.addObject({x:0, y:6, z:0}, ObjectsEnum.CUBE);
    // this.addObject({x:16, y:6, z:0}, ObjectsEnum.CUBE);
    // this.addObject({x:16, y:6, z:16}, ObjectsEnum.CUBE);
    // this.addObject({x:0, y:6, z:16}, ObjectsEnum.CUBE);
    // this.addObject({x:0, y:0, z:16}, ObjectsEnum.CUBE);
    // this.addObject({x:16, y:0, z:16}, ObjectsEnum.CUBE);
    // this.addObject({x:2, y:2, z:7}, ObjectsEnum.CUBE);
    // this.addObject({x:3, y:3, z:5}, ObjectsEnum.CUBE);

    this.addObject({x:0, y:0, z:0}, ObjectsEnum.CUBE);
    this.addObject({x:1, y:0, z:0}, ObjectsEnum.CUBE);
    this.addObject({x:2, y:0, z:0}, ObjectsEnum.CUBE);
    this.addObject({x:2, y:1, z:0}, ObjectsEnum.CUBE);
    this.addObject({x:1, y:0, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:2, y:0, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:1, y:1, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:2, y:1, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:1, y:2, z:1}, ObjectsEnum.CUBE);

    this.addObject({x:5, y:0, z:0}, ObjectsEnum.CUBE);
    this.addObject({x:6, y:0, z:0}, ObjectsEnum.CUBE);
    this.addObject({x:7, y:0, z:0}, ObjectsEnum.CUBE);
    this.addObject({x:8, y:0, z:0}, ObjectsEnum.CUBE);
    this.addObject({x:5, y:0, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:6, y:0, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:7, y:0, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:8, y:0, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:5, y:1, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:6, y:1, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:8, y:1, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:6, y:0, z:2}, ObjectsEnum.CUBE);
    this.addObject({x:7, y:0, z:2}, ObjectsEnum.CUBE);
    this.addObject({x:8, y:0, z:2}, ObjectsEnum.CUBE);
    this.addObject({x:9, y:0, z:2}, ObjectsEnum.CUBE);

    // this.addObject({x:3, y:0, z:0}, ObjectsEnum.TRUNK);
    // this.addObject({x:3, y:1, z:0}, ObjectsEnum.FOLIAGE);
  };
}
