import Array2D from 'array2d';
import CamerasEnum from './enums/CamerasEnum';
import { getEmpty2DArray, getCellContext3x3, getCornerContext2x2 } from '../helpers/Helpers';

/* global SETTINGS */

/** Class represents the topograhy of a design world */
class Topo {
  constructor(heights) {
    if (heights) {
      this.heights = heights;
    } else {
      this.heights = getEmpty2DArray(SETTINGS.yMax, SETTINGS.xMax, 0);
      // this.fill(); // can be enable to fill with a default design
    }
  }

  clear = () => {
    this.heights = getEmpty2DArray(SETTINGS.yMax, SETTINGS.xMax, 0);
  };

  increase = position => {
    const height = this.heights[position.y][position.x] + 1;
    if (height < SETTINGS.zMax) {
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
   * Get the topography height at the given positions (interpolated)
   * @param {object} path - list of 2D positions in the form {x:x,y:y}
   */
  interpolate = path => {
    // The elevation is dependent on the corners of the grid position
    const corners = this.getCorners();

    const dist = (x0, y0, x1, y1) => Math.sqrt(((x0 - x1) ** 2) + ((y0 - y1) ** 2));
    // Interpolate height based on distance to given corner
    const heights = path.map(pt => {
      const { x, y } = pt;
      const gx = Math.floor(x);
      const gy = Math.floor(y);
      const c0 = corners[gy][gx];
      const d0 = dist(x, y, gx, gy);
      const c1 = corners[gy + 1][gx];
      const d1 = dist(x, y, gx, gy + 1);
      const c2 = corners[gy][gx + 1];
      const d2 = dist(x, y, gx + 1, gy);
      const c3 = corners[gy + 1][gx + 1];
      const d3 = dist(x, y, gx + 1, gy + 1);

      if (d0 === 0) {
        return c0;
      }
      if (d1 === 0) {
        return c1;
      }
      if (d2 === 0) {
        return c2;
      }
      if (d3 === 0) {
        return c3;
      }

      const dSum = (1 / d0) + (1 / d1) + (1 / d2) + (1 / d3);
      const z = (((1 / d0) / dSum) * c0) + (((1 / d1) / dSum) * c1) + (((1 / d2) / dSum) * c2) + (((1 / d3) / dSum) * c3);
      return z;
    });

    return heights;
  }

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
        throw new Error(`camera ${camera} is not recognized!`);
    }

    const back = [];
    const front = [];
    const all = [];

    /*
    For a given slice, get the highest corners of the front of the current cube and
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
      all.push([Math.max(bottomLeft, bottom, topLeft, top, left, center), Math.max(bottom, bottomRight, top, topRight, center, right)]);
      back.push([Math.max(topLeft, top, left, center), Math.max(top, topRight, center, right)]);
      front.push([ Math.max(bottomLeft, bottom, left, center), Math.max(bottom, bottomRight, center, right) ]);
    }

    return { all, front, back };
  };

  getBackgroundSlices = (camera, sliceIndex, max = 17) => {
    let backgroundSliceIndex = sliceIndex;
    let backgroundSliceIndices = [];
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
      case CamerasEnum.TOP:
        // no background topo for top view
        break;
      default:
        throw new Error(`camera ${camera} is not recognized!`);
    }
    backgroundSliceIndices = backgroundSliceIndices.slice(0, max);
    const backgroundSlices = backgroundSliceIndices.map(i => this.getSlice(camera, i));
    return backgroundSlices;
  }

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
        // console.log(topLeft, topRight, bottomLeft, bottomRight);
        corners[y][x] = Math.max(topLeft, topRight, bottomLeft, bottomRight);
      }
    }

    // console.dir(corners);
    return corners;
  };

  getHighestNonZeroPoint = () => {
    let max = 0;
    let loc = null;
    this.heights.forEach((row, y) => row.forEach((z, x) => {
      if (z > max) {
        max = z;
        loc = { x, y, z };
      }
    }));
    return loc;
  };

  fill = () => {
    this.heights[8][12] = 1;
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
