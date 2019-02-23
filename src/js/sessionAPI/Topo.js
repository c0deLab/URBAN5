import Array2D from 'array2d';
import CamerasEnum from '../enums/CamerasEnum';
import { getEmpty2DArray, getCellContext3x3, getCornerContext2x2 } from '../helpers/ArrayHelpers';

/* global SETTINGS */

/** Class represents the topograhy of a design world */
class Topo {
  constructor(heights) {
    if (heights) {
      this.heights = heights;
    } else {
      this.heights = getEmpty2DArray(SETTINGS.yMax, SETTINGS.xMax, 0);
    }
  }

  increase = position => {
    const height = this.heights[position.y][position.x] + 1;
    if (height <= SETTINGS.zMax) {
      this.heights[position.y][position.x] = height;
    }
  };

  decrease = position => {
    const height = this.heights[position.y][position.x] - 1;
    if (height >= 0) {
      this.heights[position.y][position.x] = height;
    }
  };

  /**
   * Get the topography height at a given position
   * @param {object} position - 2D position in the form {x:x,y:y}
   */
  getAt = position => this.heights[position.y][position.x];

  /**
   * Get a the 1D array of heights for the given slice at the camera angle
   * @param {int} camera - The CamerasEnum camera view
   * @param {int} sliceIndex - The current slice being viewed from that camera view
   */
  getSlice = (camera, sliceIndex) => {
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

  /**
   * Get 2D array of all the corner heights (at each corner use the highest adjacent tile)
   */
  getCorners = () => {
    const { length } = this.heights;
    const cornersLength = length + 1;
    // Create a 2D array 1 longer and wider than heights
    const corners = getEmpty2DArray(cornersLength, cornersLength, 0);

    for (let y = 0; y < cornersLength; y += 1) {
      for (let x = 0; x < cornersLength; x += 1) {
        const context = getCornerContext2x2(this.heights, x, y);
        const {
          topLeft, topRight, bottomLeft, bottomRight
        } = context;
        console.log(topLeft, topRight, bottomLeft, bottomRight);
        corners[y][x] = Math.max(topLeft, topRight, bottomLeft, bottomRight);
      }
    }

    console.dir(corners);
    return corners;
  };
}

Topo.freeze = topo => {
  const jsonStr = JSON.stringify(topo);
  const json = JSON.parse(jsonStr);

  return json;
};

Topo.thaw = json => {
  const { heights } = json;
  const topo = new Topo(heights);
  return topo;
};

export default Topo;
