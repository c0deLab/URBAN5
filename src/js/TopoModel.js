import Array2D from 'array2d';
import CamerasEnum from './enums/CamerasEnum';
import { getEmpty2DArray, getCellContext3x3 } from './ArrayHelpers';

/** Class represents the topograhy of a design world */
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
   * Get a the 1D array of heights for the given slice at the camera angle
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

    /*
    For a given slice, get the highest corners of the current cube and
    the cubes in front and back and left and right. Imagine a sheet hung
    over stacks of cubes. That is what we represent. This is necessary
    because we set the heights of the cells, but we render the heights
    at half way points in the slices.
    */
    for (let i = 0; i < heightsView[sliceIndex].length; i += 1) {
      // Get the context
      const context = getCellContext3x3(heightsView, i, sliceIndex);
      const {
        topLeft, top, topRight, left, center, right, bottomLeft, bottom, bottomRight
      } = context;
      // Find the heightest points
      startHeight = Math.max(topLeft, top, left, center, bottomLeft, bottom);
      endHeight = Math.max(top, topRight, center, right, bottom, bottomRight);
      heightPairs.push({ startHeight, endHeight });
    }

    return heightPairs;
  };
}
