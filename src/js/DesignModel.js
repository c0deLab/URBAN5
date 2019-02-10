import Array2D from 'array2d';
import ObjectsEnum from './enums/ObjectsEnum';
import CamerasEnum from './enums/CamerasEnum';
import TopoModel from './TopoModel';
import { getEmpty2DArray, getCellContext3D } from './ArrayHelpers';

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
export default class DesignModel {
  constructor() {
    this.xMax = SETTINGS.xMax;
    this.yMax = SETTINGS.yMax;
    this.zMax = SETTINGS.zMax;

    // init empty world
    this.objects = this._empty3DArray();
    this.topo = new TopoModel(this.xMax, this.yMax);

    // add some things to it to start
    this._populate();
  }

  /**
   * Add an object at a certain position.
   * @param {object} position - 3D position in the form {x:x,y:y,z:z}
   * @param {int} obj - int representing the ObjectsEnum object
   */
  addObject = (position, obj, modifier) => {
    console.log(position);
    switch (obj) {
      case ObjectsEnum.TREE:
        if (position.y < (this.yMax - 1)) {
          const { x, y } = position;
          let { z } = position;
          z += 1;
          const foliagePosition = { x, y, z };
          // Check placement spot and placement spot above
          if (this._getCell(position) === null && this._getCell(foliagePosition) === null) {
            this._setCell(position, new Trunk(position));
            this._setCell(foliagePosition, new Foliage(foliagePosition));
            return true;
          }
        }
        return false;
      case ObjectsEnum.CUBE:
        if (this._getCell(position) === null) {
          const context = getCellContext3D(this.objects, position);
          const c = new Cube(position, context);
          this._setCell(position, c);
          return true;
        }
        break;
      case ObjectsEnum.ROOF:
        if (this._getCell(position) === null) {
          const context = getCellContext3D(this.objects, position);
          const r = new Roof(position, modifier, context);
          this._setCell(position, r);
          return true;
        }
        break;
      default:
        return false;
    }

    return false;
  }

  /**
   * Remove the object at a certain position
   * @param {object} position - 3D position in the form {x:x,y:y,z:z}
   */
  removeObject = position => {
    const obj = this._getCell(position);

    switch (obj) {
      case ObjectsEnum.TREE:
        if (position.z < (this.zMax - 1)) {
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
        if (obj && obj.remove) {
          const context = getCellContext3D(this.objects, position);
          obj.remove(context);
        }
        this._setCell(position, null);
        break;
    }
  }

  /**
   * For a given slice, get the highest corners of the current
   * cube and the cubes in front and back and left and right. Imagine a sheet hung
   * over stacks of cubes. That is what we represent.
   * @param {int} camera - The CamerasEnum camera view
   * @param {int} slice - The current slice being viewed from that camera view
   */
  getTopoSlice = (camera, slice) => this.topo.getTopoSlice(camera, slice)

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
        while (backgroundSliceIndex < (this.yMax - 1)) {
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
        while (backgroundSliceIndex < (this.xMax - 1)) {
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
        while (backgroundSliceIndex < (this.zMax - 1)) {
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
    const slice = getEmpty2DArray(this.zMax, this.yMax);
    for (let z = 0; z < this.zMax; z += 1) {
      for (let y = 0; y < this.yMax; y += 1) {
        slice[z][y] = this.objects[z][y][x];
      }
    }
    return slice;
  }

  _getYSlice = y => {
    const slice = getEmpty2DArray(this.zMax, this.xMax);
    for (let z = 0; z < this.zMax; z += 1) {
      for (let x = 0; x < this.xMax; x += 1) {
        slice[z][x] = this.objects[z][y][x];
      }
    }
    return slice;
  }

  _getCell = position => {
    const { x, y, z } = position;
    if (x >= 0 && y >= 0 && z >= 0 && x < this.xMax && y < this.yMax && z < this.zMax) {
      return this.objects[z][y][x];
    }
    return null;
  }

  _setCell = (position, object) => {
    const { x, y, z } = position;
    if (x >= 0 && y >= 0 && z >= 0 && x < this.xMax && y < this.yMax && z < this.zMax) {
      this.objects[z][y][x] = object;
    }
  }

  /** Create an empty version of the design model */
  _empty3DArray = () => {
    const arr = new Array(this.zMax);

    for (let i = 0; i < arr.length; i += 1) {
      arr[i] = getEmpty2DArray(this.yMax, this.xMax, null);
    }

    return arr;
  }

  _addCube = position => {
    const context = getCellContext3D(position);
    const c = new Cube(position, context);
    this.addObject(position, c);
  }

  /** Populates the design world with some objects */
  _populate = () => {
    // const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

    // for (let i = 0; i < 100; i += 1) {
    //   this.addObject({x:getRandomInt(17), y:getRandomInt(17), z:getRandomInt(7)}, ObjectsEnum.CUBE);
    // }

    // this.addObject({ x: 9, y: 10 + 16, z: 0 }, ObjectsEnum.CUBE);
    // this.addObject({ x: 10, y: 10 + 16, z: 0 }, ObjectsEnum.CUBE);
    // this.addObject({ x: 9, y: 10 + 16, z: 1 }, ObjectsEnum.ROOFLEFT);
    // this.addObject({ x: 10, y: 10 + 16, z: 1 }, ObjectsEnum.ROOFRGHT);
    // this.addObject({ x: 11, y: 10 + 15, z: 0 }, ObjectsEnum.TREE);
    // this.addObject({ x: 11, y: 10 + 15, z: 1 }, ObjectsEnum.FOLIAGE);

    this.addObject({ x: 11, y: 10, z: 0 }, 0);
    this.addObject({ x: 11, y: 10, z: 1 }, 0);
    this.addObject({ x: 11, y: 10, z: 2 }, 1, 'w');

    this.addObject({ x: 12, y: 10, z: 0 }, 0);
    this.addObject({ x: 12, y: 10, z: 1 }, 0);
    this.addObject({ x: 12, y: 10, z: 2 }, 1, 'e');

    this.addObject({ x: 13, y: 10, z: 0 }, 0);
    this.addObject({ x: 13, y: 10, z: 1 }, 1, 'e');

    this.addObject({ x: 14, y: 10, z: 0 }, 0);

    this.addObject({ x: 15, y: 10, z: 0 }, 0);

    this.addObject({ x: 16, y: 10, z: 0 }, 2);

    this.addObject({ x: 9, y: 13, z: 0 }, 0);
    this.addObject({ x: 9, y: 13, z: 1 }, 1, 's');

    this.addObject({ x: 9, y: 14, z: 0 }, 0);
    this.addObject({ x: 9, y: 14, z: 1 }, 1, 'n');


    this.addObject({ x: 13, y: 5, z: 1 }, 1, 'e');

    // this.addObject({ x: 12, y: 15, z: 0 }, 0);


    // this.addObject({ x: 3, y: 10 + 0, z: 3 }, 0);
    // this.addObject({ x: 4, y: 10 + 0, z: 3 }, 0);
    // this.addObject({ x: 2, y: 10 + 0, z: 4 }, 0);
    // this.addObject({ x: 3, y: 10 + 0, z: 4 }, 0);
    // this.addObject({ x: 4, y: 10 + 0, z: 4 }, 0);
    // this.addObject({ x: 2, y: 10 + 0, z: 5 }, 0);
    // this.addObject({ x: 3, y: 10 + 0, z: 5 }, 0);
    // this.addObject({ x: 4, y: 10 + 0, z: 5 }, 0);
    // this.addObject({ x: 13, y: 10 + 0, z: 0 }, 0);
    // this.addObject({ x: 12, y: 10 + 0, z: 0 }, 0);
    // this.addObject({ x: 12, y: 10 + 0, z: 1 }, 0);
    // this.addObject({ x: 11, y: 10 + 0, z: 1 }, 0);
    // this.addObject({ x: 10, y: 10 + 0, z: 1 }, 0);
    // this.addObject({ x: 11, y: 10 + 0, z: 2 }, 1, 'e');
    // this.addObject({ x: 14, y: 10 + 0, z: 0 }, 1, 'w');
    // this.addObject({ x: 15, y: 10 + 0, z: 0 }, 2);
    // this.addObject({ x: 8, y: 10 + 0, z: 0 }, 2);
    // this.addObject({ x: 4, y: 10 + 1, z: 1 }, 0);
    // this.addObject({ x: 4, y: 10 + 1, z: 2 }, 0);
    // this.addObject({ x: 3, y: 10 + 1, z: 2 }, 0);
    // this.addObject({ x: 5, y: 10 + 1, z: 2 }, 0);
    // this.addObject({ x: 6, y: 10 + 1, z: 2 }, 0);
    // this.addObject({ x: 6, y: 10 + 1, z: 3 }, 0);
    // this.addObject({ x: 7, y: 10 + 1, z: 3 }, 0);
    // this.addObject({ x: 8, y: 10 + 1, z: 0 }, 0);
    // this.addObject({ x: 9, y: 10 + 1, z: 0 }, 0);
    // this.addObject({ x: 9, y: 10 + 1, z: 1 }, 0);
    // this.addObject({ x: 11, y: 10 + 1, z: 0 }, 0);
    // this.addObject({ x: 9, y: 10 + 2, z: 2 }, 0);
    // this.addObject({ x: 9, y: 10 + 2, z: 3 }, 1, 'n');

    for (let y = 0; y < 17; y += 1) {
      this.topo.setTopoHeight({ x: 0, y }, 2);
      this.topo.setTopoHeight({ x: 1, y }, 2);
      this.topo.setTopoHeight({ x: 2, y }, 2);
      this.topo.setTopoHeight({ x: 3, y }, 1);
      this.topo.setTopoHeight({ x: 4, y }, 1);
      this.topo.setTopoHeight({ x: 5, y }, 1);
      this.topo.setTopoHeight({ x: 0, y }, 2);
      this.topo.setTopoHeight({ x: 1, y }, 2);
      this.topo.setTopoHeight({ x: 2, y }, 2);
      this.topo.setTopoHeight({ x: 3, y }, 1);
      this.topo.setTopoHeight({ x: 4, y }, 1);
      this.topo.setTopoHeight({ x: 5, y }, 1);
    }
  }
}
