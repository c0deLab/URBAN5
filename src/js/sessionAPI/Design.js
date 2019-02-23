import Array2D from 'array2d';
import ObjectsEnum from '../enums/ObjectsEnum';
import CamerasEnum from '../enums/CamerasEnum';

import { getEmpty2DArray, getCellContext3D } from '../helpers/ArrayHelpers';
import { getOppositeDirection } from '../helpers/Helpers';

import Cube from './Cube';
import Roof from './Roof';
import { Foliage, Trunk } from './Tree';

/* global SETTINGS */

/**
 * Represents the data of a design world
 *
 * The world is similar to Google Sketchup. The standard view "North" (looking North)
 * has x increasing from left to right, y, starting at 0 and increasing as it moves
 * away from you, and z increasing as it goes up.
 *
 */
class Design {
  constructor(objects) {
    if (objects) {
      this.objects = objects;
    } else {
      // init empty world
      this.objects = this._empty3DArray();

      this.fill();
    }
  }

  getAll = () => this.objects;

  /**
   * Add an object at a certain position.
   * @param {object} position - 3D position in the form {x:x,y:y,z:z}
   * @param {int} obj - int representing the ObjectsEnum object
   */
  add = (obj, position, modifier) => {
    const context = getCellContext3D(this.objects, position);
    let newObject;
    switch (obj) {
      case ObjectsEnum.TREE:
        if (position.y < (SETTINGS.yMax - 1)) {
          const { x, y } = position;
          let { z } = position;
          z += 1;
          const foliagePosition = { x, y, z };
          // Check placement spot and placement spot above
          this._setCell(position, new Trunk(position));
          this._setCell(foliagePosition, new Foliage(foliagePosition));
          return true;
        }
        return false;
      case ObjectsEnum.CUBE:
        newObject = new Cube();
        this._setCell(position, newObject);
        newObject.hookAfterInsert(context);
        return true;
      case ObjectsEnum.ROOF:
        newObject = new Roof();
        this._setCell(position, newObject);
        newObject.hookAfterInsert(modifier, context);
        return true;
      default:
        return false;
    }
  }

  /**
   * Remove the object at a certain position
   * @param {object} position - 3D position in the form {x:x,y:y,z:z}
   */
  remove = position => {
    const obj = this._getCell(position);

    switch (obj) {
      case ObjectsEnum.TREE:
        if (position.z < (SETTINGS.zMax - 1)) {
          this._setCell(position, null);
          const { x, y } = position;
          let { z } = position;
          z += 1;
          this._setCell({ x, y, z }, null);
        }
        break;
      case ObjectsEnum.FOLIAGE:
        if (position.z > 0) {
          this._setCell(position, null);
          const { x, y } = position;
          let { z } = position;
          z -= 1;
          this._setCell({ x, y, z }, null);
        }
        break;
      default:
        if (obj && obj.hookBeforeRemove) {
          const context = getCellContext3D(this.objects, position);
          obj.hookBeforeRemove(context);
        }
        this._setCell(position, null);
        break;
    }
  }

  /**
   * Use the camera and 2D side (l, r, t, b) to get a cardinal
   * point (n,s,e,w,t,b) and set that surface at the model position
   * to the given surface.
   */
  setSurface = (camera, position, side, surface) => {
    const obj = this._getCell(position);

    const sideCardinal = this.getCardinalSide(camera, side);
    if (obj && obj.setSurface) {
      obj.setSurface(sideCardinal, surface);
    }

    const context = getCellContext3D(this.objects, position);
    const sharedWallNeighbor = context[sideCardinal];
    if (sharedWallNeighbor && sharedWallNeighbor.setSurface) {
      sharedWallNeighbor.setSurface(getOppositeDirection(sideCardinal), surface);
    }
  }

  getCardinalSide = (camera, side) => {
    let sideCardinal;
    if (side === 't' || side === 'b') {
      switch (camera) {
        case CamerasEnum.NORTH:
        case CamerasEnum.SOUTH:
        case CamerasEnum.EAST:
        case CamerasEnum.WEST:
          sideCardinal = side;
          break;
        case CamerasEnum.BOTTOM:
          if (side === 't') {
            sideCardinal = 's';
          } else {
            sideCardinal = 'n';
          }
          break;
        case CamerasEnum.TOP:
          if (side === 't') {
            sideCardinal = 'n';
          } else {
            sideCardinal = 's';
          }
          break;
        default:
          throw new Error(`camera ${camera} is not recognized!`);
      }
    } else {
      switch (camera) {
        case CamerasEnum.NORTH:
          if (side === 'l') {
            sideCardinal = 'w';
          } else if (side === 'r') {
            sideCardinal = 'e';
          }
          break;
        case CamerasEnum.SOUTH:
          if (side === 'l') {
            sideCardinal = 'e';
          } else if (side === 'r') {
            sideCardinal = 'w';
          }
          break;
        case CamerasEnum.EAST:
          if (side === 'l') {
            sideCardinal = 'n';
          } else if (side === 'r') {
            sideCardinal = 's';
          }
          break;
        case CamerasEnum.WEST:
          if (side === 'l') {
            sideCardinal = 's';
          } else if (side === 'r') {
            sideCardinal = 'n';
          }
          break;
        case CamerasEnum.BOTTOM:
        case CamerasEnum.TOP:
          if (side === 'l') {
            sideCardinal = 'w';
          } else if (side === 'r') {
            sideCardinal = 'e';
          }
          break;
        default:
          throw new Error(`camera ${camera} is not recognized!`);
      }
    }
    return sideCardinal;
  }

  /**
   * Returns 2D array of objects in the given slice
   * @param {int} camera - The CamerasEnum camera view
   * @param {int} sliceIndex - The current slice being viewed from that camera view
   */
  getSlice = (camera, sliceIndex) => {
    let ySlice;
    let xSlice;
    let zSlice;
    switch (camera) {
      case CamerasEnum.NORTH:
        return this._getYSlice(sliceIndex);
      case CamerasEnum.SOUTH:
        ySlice = this._getYSlice(sliceIndex);
        return Array2D.hflip(ySlice);
      case CamerasEnum.EAST:
        xSlice = this._getXSlice(sliceIndex);
        return Array2D.hflip(xSlice);
      case CamerasEnum.WEST:
        return this._getXSlice(sliceIndex);
      case CamerasEnum.BOTTOM:
        zSlice = this._getZSlice(sliceIndex);
        return Array2D.vflip(zSlice);
      case CamerasEnum.TOP:
        return this._getZSlice(sliceIndex);
      default:
        throw new Error(`camera ${camera} is not recognized!`);
    }
  }

  getBackgroundSlices = (camera, sliceIndex) => {
    let backgroundSliceIndex = sliceIndex;
    const backgroundSliceIndices = [];
    switch (camera) {
      case CamerasEnum.NORTH:
        while (backgroundSliceIndex < (SETTINGS.yMax - 1)) {
          backgroundSliceIndex += 1;
          backgroundSliceIndices.push(backgroundSliceIndex);
        }
        break;
      case CamerasEnum.SOUTH:
        while (backgroundSliceIndex > 0) {
          backgroundSliceIndex -= 1;
          backgroundSliceIndices.push(backgroundSliceIndex);
        }
        break;
      case CamerasEnum.EAST:
        while (backgroundSliceIndex < (SETTINGS.xMax - 1)) {
          backgroundSliceIndex += 1;
          backgroundSliceIndices.push(backgroundSliceIndex);
        }
        break;
      case CamerasEnum.WEST:
        while (backgroundSliceIndex > 0) {
          backgroundSliceIndex -= 1;
          backgroundSliceIndices.push(backgroundSliceIndex);
        }
        break;
      case CamerasEnum.BOTTOM:
        while (backgroundSliceIndex < (SETTINGS.zMax - 1)) {
          backgroundSliceIndex += 1;
          backgroundSliceIndices.push(backgroundSliceIndex);
        }
        break;
      case CamerasEnum.TOP:
        while (backgroundSliceIndex > 0) {
          backgroundSliceIndex -= 1;
          backgroundSliceIndices.push(backgroundSliceIndex);
        }
        break;
      default:
        throw new Error(`camera ${camera} is not recognized!`);
    }
    const backgroundSlices = backgroundSliceIndices.map(i => this.getSlice(camera, i));
    return backgroundSlices;
  }

  _getZSlice = z => this.objects[z]

  _getXSlice = x => {
    const slice = getEmpty2DArray(SETTINGS.zMax, SETTINGS.yMax);
    for (let z = 0; z < SETTINGS.zMax; z += 1) {
      for (let y = 0; y < SETTINGS.yMax; y += 1) {
        slice[z][y] = this.objects[z][y][x];
      }
    }
    return slice;
  }

  _getYSlice = y => {
    const slice = getEmpty2DArray(SETTINGS.zMax, SETTINGS.xMax);
    for (let z = 0; z < SETTINGS.zMax; z += 1) {
      for (let x = 0; x < SETTINGS.xMax; x += 1) {
        slice[z][x] = this.objects[z][y][x];
      }
    }
    return slice;
  }

  _getCell = position => {
    const { x, y, z } = position;
    if (x >= 0 && y >= 0 && z >= 0 && x < SETTINGS.xMax && y < SETTINGS.yMax && z < SETTINGS.zMax) {
      return this.objects[z][y][x];
    }
    return null;
  }

  _setCell = (position, object) => {
    const { x, y, z } = position;
    if (x >= 0 && y >= 0 && z >= 0 && x < SETTINGS.xMax && y < SETTINGS.yMax && z < SETTINGS.zMax) {
      this.objects[z][y][x] = object;
    }
  }

  /** Create an empty version of the design model */
  _empty3DArray = () => {
    const arr = new Array(SETTINGS.zMax);

    for (let i = 0; i < arr.length; i += 1) {
      arr[i] = getEmpty2DArray(SETTINGS.yMax, SETTINGS.xMax, null);
    }

    return arr;
  }

  _addCube = position => {
    const context = getCellContext3D(position);
    const c = new Cube(position, context);
    this.addObject(position, c);
  }

  fill = () => {
    const addObject = (pos, type, mod) => {
        this.add(type, pos, mod);
    };

    addObject({ x: 11, y: 3, z: 0 }, 0);
    addObject({ x: 11, y: 3, z: 1 }, 0);
    addObject({ x: 11, y: 3, z: 2 }, 1, 'w');

    addObject({ x: 12, y: 3, z: 0 }, 0);
    addObject({ x: 12, y: 3, z: 1 }, 0);
    addObject({ x: 12, y: 3, z: 2 }, 1, 'e');

    addObject({ x: 13, y: 3, z: 0 }, 0);
    addObject({ x: 13, y: 3, z: 1 }, 1, 'e');

    addObject({ x: 14, y: 3, z: 0 }, 0);

    addObject({ x: 15, y: 3, z: 0 }, 0);

    addObject({ x: 16, y: 3, z: 0 }, 2);

    addObject({ x: 9, y: 13, z: 0 }, 0);
    addObject({ x: 9, y: 13, z: 1 }, 1, 's');

    addObject({ x: 9, y: 14, z: 0 }, 0);
    addObject({ x: 9, y: 14, z: 1 }, 1, 'n');


    addObject({ x: 13, y: 5, z: 4 }, 1, 'e');

    addObject({ x: 5, y: 0, z: 1 }, 1, 'e');
    addObject({ x: 7, y: 0, z: 0 }, 0);
    addObject({ x: 9, y: 0, z: 0 }, 0);
    addObject({ x: 10, y: 0, z: 0 }, 0);


    addObject({ x: 1, y: 1, z: 2 }, 0);
    addObject({ x: 2, y: 1, z: 2 }, 0);
    addObject({ x: 1, y: 2, z: 2 }, 0);
    addObject({ x: 2, y: 2, z: 2 }, 0);
    addObject({ x: 1, y: 2, z: 3 }, 0);
    addObject({ x: 2, y: 2, z: 3 }, 0);

    addObject({ x: 4, y: 2, z: 5 }, 1, 's');
    addObject({ x: 4, y: 2, z: 5 }, 1, 'n');

    addObject({ x: 4, y: 2, z: 5 }, 1, 's');
    addObject({ x: 4, y: 2, z: 5 }, 1, 'n');
  }
}

Design.freeze = design => {
  const jsonStr = JSON.stringify(design);
  const json = JSON.parse(jsonStr);

  return json;
};

Design.thaw = json => {
  const { objects } = json;
  const objectsUnpacked = this._empty3DArray();
  // Deserialize all the object data into objects
  for (let z = 0; z < SETTINGS.zMax; z += 1) {
    for (let y = 0; y < SETTINGS.xMax; y += 1) {
      for (let x = 0; x < SETTINGS.xMax; x += 1) {
        const objectData = objects[z][y][x];
        const { type } = objectData;
        let object = null;
        switch (type) {
          case ObjectsEnum.CUBE:
            object = new Cube(objectData);
            break;
          case ObjectsEnum.ROOF:
            object = new Roof(objectData);
            break;
          case ObjectsEnum.FOLIAGE:
            object = new Foliage(objectData);
            break;
          case ObjectsEnum.TRUNK:
            object = new Trunk(objectData);
            break;
          default:
            break;
        }

        objectsUnpacked[z][y][x] = object;
      }
    }
  }

  const design = new Design(objectsUnpacked);
  return design;
};

export default Design;
