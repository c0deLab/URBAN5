import ObjectsEnum from './enums/ObjectsEnum';
import CamerasEnum from './enums/CamerasEnum';

/**
 * Represents the data of a design world
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
  }

  /**
   * Add an object at a certain position.
   * @param {object} position - 3D position in the form {x:x,y:y,z:z}
   * @param {int} obj - int representing the ObjectsEnum object
   */
  addObject = (position, obj) => {
    console.log(`Add ${obj} at (${position.x}, ${position.y}, ${position.z})`);
    let i;
    switch (obj) {
      case ObjectsEnum.TREE:
        if (position.y < (this.yMax - 1)) {
          i = this._getIndexFromPosition(position);
          const { x, z } = position;
          let { y } = position;
          y += 1;
          const foliageIndex = this._getIndexFromPosition({ x, y, z });
          // Check placement spot and placement spot above
          if (this.objects[i] === null && this.objects[foliageIndex] === null) {
            this.objects[i] = obj;
            this.objects[foliageIndex] = ObjectsEnum.FOLIAGE;
          }
        }
        break;
      default:
        i = this._getIndexFromPosition(position);
        if (this.objects[i] === null) {
          this.objects[i] = obj;
        }
        break;
    }
  };

  /**
   * Remove the object at a certain position
   * @param {object} position - 3D position in the form {x:x,y:y,z:z}
   */
  removeObject = position => {
    console.log(`Remove object at (${position.x}, ${position.y}, ${position.z})`);
    const i = this._getIndexFromPosition(position);
    const obj = this.objects[i];

    switch (obj) {
      case ObjectsEnum.TREE:
        if (position.y < (this.yMax - 1)) {
          const { x, z } = position;
          let { y } = position;
          y += 1;
          const foliageIndex = this._getIndexFromPosition({ x, y, z });
          this.objects[i] = null;
          this.objects[foliageIndex] = null;
        }
        break;
      case ObjectsEnum.FOLIAGE:
        if (position.y > 0) {
          const { x, z } = position;
          let { y } = position;
          y -= 1;
          const treeIndex = this._getIndexFromPosition({ x, y, z });
          this.objects[i] = null;
          this.objects[treeIndex] = null;
        }
        break;
      default:
        this.objects[i] = null;
        break;
    }
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
   * @param {int} camera - The CamerasEnum camera view
   * @param {int} slice - The current slice being viewed from that camera view
   */
  getSlice = (camera, slice) => {
    const sliceObjects = this._getEmptySliceArray(camera, slice);

    this.objects.forEach((object, i) => {
      const position = this._getPosition(i);

      switch (camera) {
        case CamerasEnum.SOUTH:
          if (position.z === slice) {
            sliceObjects[position.x][position.y] = object;
          }
          break;
        case CamerasEnum.NORTH:
          if (position.z === (this.zMax - 1 - slice)) {
            sliceObjects[this.xMax - 1 - position.x][position.y] = object;
          }
          break;
        case CamerasEnum.WEST:
          if (position.x === slice) {
            sliceObjects[position.z][position.y] = object;
          }
          break;
        case CamerasEnum.EAST:
          if (position.x === (this.xMax - 1 - slice)) {
            sliceObjects[this.zMax - 1 - position.z][position.y] = object;
          }
          break;
        case CamerasEnum.BOTTOM:
          if (position.y === slice) {
            sliceObjects[position.x][this.zMax - 1 - position.z] = object;
          }
          break;
        case CamerasEnum.TOP:
          if (position.y === (this.yMax - 1 - slice)) {
            sliceObjects[position.x][position.z] = object;
          }
          break;
        default:
          throw new Error(`camera ${camera} is not recognized!`);
      }
    });

    return sliceObjects;
  };

  /**
   * Returns a union of all the slices behind the current slice from the current
   * camera view with respect to cubes.
   * @param {int} camera - The CamerasEnum camera view
   * @param {int} slice - The current slice being viewed from that camera view
   */
  getBackgroundSlice = (camera, slice) => {
    const sliceObjects = this._getEmptySliceArray(camera, slice);

    this.objects.forEach((object, i) => {
      const position = this._getPosition(i);

      if (object === ObjectsEnum.CUBE) {
        switch (camera) {
          case CamerasEnum.SOUTH:
            if (position.z > slice) {
              sliceObjects[position.x][position.y] = object;
            }
            break;
          case CamerasEnum.NORTH:
            if (position.z < (this.zMax - 1 - slice)) {
              sliceObjects[this.xMax - 1 - position.x][position.y] = object;
            }
            break;
          case CamerasEnum.WEST:
            if (position.x > slice) {
              sliceObjects[position.z][position.y] = object;
            }
            break;
          case CamerasEnum.EAST:
            if (position.x < (this.xMax - 1 - slice)) {
              sliceObjects[this.zMax - 1 - position.z][position.y] = object;
            }
            break;
          case CamerasEnum.BOTTOM:
            if (position.y > slice) {
              sliceObjects[position.x][this.zMax - 1 - position.z] = object;
            }
            break;
          case CamerasEnum.TOP:
            if (position.y < (this.yMax - 1 - slice)) {
              sliceObjects[position.x][position.z] = object;
            }
            break;
          default:
            throw new Error(`camera ${camera} is not recognized!`);
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
    const x = Math.floor(i / (this.zMax * this.yMax));
    const xRemainder = i % (this.zMax * this.yMax);
    const y = Math.floor(xRemainder / this.zMax);
    const z = i % this.zMax;

    return { x, y, z };
  };

  /**
   * Returns the index in a flattened version of a 3D array
   * @param {object} position - The 3D position in the form {x:x,y:y,z:z}
   */
  _getIndexFromPosition = position => (position.x * this.yMax * this.zMax) + (position.y * this.zMax) + position.z;

  /**
   * Returns an empty 2D array of the correct size for a slice from a given view
   * @param {int} camera - The CamerasEnum camera view
   */
  _getEmptySliceArray = camera => {
    let columns;
    let rows;

    switch (camera) {
      case CamerasEnum.NORTH:
      case CamerasEnum.SOUTH:
        columns = this.xMax;
        rows = this.yMax;
        break;
      case CamerasEnum.WEST:
      case CamerasEnum.EAST:
        columns = this.zMax;
        rows = this.yMax;
        break;
      case CamerasEnum.TOP:
      case CamerasEnum.BOTTOM:
        columns = this.xMax;
        rows = this.zMax;
        break;
      default:
        throw new Error(`camera ${camera} is not recognized!`);
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
    for (let i = 0; i < columns; i += 1) {
      arr[i] = new Array(rows);
    }
    return arr;
  };

  /** Create an empty version of the design model */
  _initObjects = () => {
    const objects = new Array(this.xMax * this.yMax * this.zMax);

    for (let i = 0; i < objects.length; i += 1) {
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
    this.addObject({x:0, y:1, z:0}, ObjectsEnum.ROOFLEFT);
    this.addObject({x:1, y:1, z:0}, ObjectsEnum.ROOFRGHT);
    this.addObject({x:7, y:1, z:0}, ObjectsEnum.ROOFLEFT);
    this.addObject({x:8, y:1, z:0}, ObjectsEnum.ROOFRGHT);
    this.addObject({x:3, y:0, z:0}, ObjectsEnum.CUBE);
    this.addObject({x:3, y:1, z:0}, ObjectsEnum.ROOFRGHT);

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
    this.addObject({x:11, y:0, z:0}, ObjectsEnum.TREE);

    // this.addObject({x:3, y:0, z:0}, ObjectsEnum.TRUNK);
    // this.addObject({x:3, y:1, z:0}, ObjectsEnum.FOLIAGE);
  };
}
