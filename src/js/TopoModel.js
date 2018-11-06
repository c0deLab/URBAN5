import Array2D from 'array2d';
import CamerasEnum from './enums/CamerasEnum';
import { getEmpty2DArray, getCellContext3x3 } from './ArrayHelpers';

/**
 * Represents the data of a design world
 */
export default class TopoModel {
  constructor(xMax, yMax) {
    this.xMax = xMax;
    this.yMax = yMax;

    this.heights = getEmpty2DArray(this.yMax, this.xMax, 0);
  }

  /**
   * Set the topography height at a given position
   * @param {object} position - 2D position in the form {x:x,y:y}
   * @param {int} height - The y value of the topo at the position
   */
  setTopoHeight = (position, height) => {
    this.heights[position.y][position.x] = height;
  };

  /**
   * For a given slice, get the highest corners of the current
   * cube and the cubes in front and back and left and right. Imagine a sheet hung
   * over stacks of cubes. That is what we represent.
   * @param {int} camera - The CamerasEnum camera view
   * @param {int} sliceIndex - The current slice being viewed from that camera view
   */
  getTopoSlice = (camera, sliceIndex) => {
    // console.log(`camera ${camera} and sliceIndex ${sliceIndex}`);
    let heightsView;
    switch (camera) {
      case CamerasEnum.NORTH:
        heightsView = this.heights;
        break;
      case CamerasEnum.SOUTH:
        heightsView = Array2D.hflip(this.heights);
        break;
      case CamerasEnum.EAST:
        heightsView = Array2D.hflip(Array2D.transpose(this.heights));
        break;
      case CamerasEnum.WEST:
        heightsView = Array2D.transpose(this.heights);
        break;
      case CamerasEnum.BOTTOM:
      case CamerasEnum.TOP:
        return null;
      default:
        throw new Error(`camera ${camera} is not recogniyed!`);
    }

    let startHeight;
    let endHeight;
    const heightPairs = [];

    if (sliceIndex >= heightsView.length) {
      return null;
    }

    for (let i = 0; i < heightsView[sliceIndex].length; i += 1) {
      const context = getCellContext3x3(heightsView, i, sliceIndex);
      const {
        topLeft, top, topRight, left, center, right, bottomLeft, bottom, bottomRight
      } = context;
      startHeight = Math.max(topLeft, top, left, center, bottomLeft, bottom);
      endHeight = Math.max(top, topRight, center, right, bottom, bottomRight);
      heightPairs.push({ startHeight, endHeight });
    }

    return heightPairs;
  };
}
