/**
* Helper functions for dealing with arrays.
*/

function getSafe(arr, x, y) {
  if (x >= 0 && arr.length > 0 && arr[0].length && x < arr[0].length && y >= 0 && y < arr.length) {
    return arr[y][x];
  }
  return null;
}

function getSafe3D(arr, x, y, z) {
  if (arr.length > 0 && arr[0].length && arr[0][0].length
      && x >= 0 && x < arr[0][0].length
      && y >= 0 && y < arr[0].length
      && z >= 0 && z < arr.length) {
    return arr[z][y][x];
  }
  return null;
}

/**
* Given a 2D array 'arr' and a position, get the position and all cells around it as an object
* This can be unpacked as follows:
* const { topLeft, top, topRight, left, center, right, bottomLeft, bottom, bottomRight } = context;
*/
export function getCellContext3x3(arr, x, y) {
  return {
    topLeft: getSafe(arr, x - 1, y + 1),
    top: getSafe(arr, x, y + 1),
    topRight: getSafe(arr, x + 1, y + 1),
    left: getSafe(arr, x - 1, y),
    center: getSafe(arr, x, y),
    right: getSafe(arr, x + 1, y),
    bottomLeft: getSafe(arr, x - 1, y - 1),
    bottom: getSafe(arr, x, y - 1),
    bottomRight: getSafe(arr, x + 1, y - 1)
  };
}

/**
* Given a 2D array 'arr' and a position, get the position and all cells around it as an object
* This can be unpacked as follows:
* const { n, e, s, w, t, b } = context;
*/
export function getCellContext3D(arr, position) {
  const { x, y, z } = position;
  return {
    w: getSafe3D(arr, x - 1, y, z),
    n: getSafe3D(arr, x, y + 1, z),
    e: getSafe3D(arr, x + 1, y, z),
    s: getSafe3D(arr, x, y - 1, z),
    t: getSafe3D(arr, x, y, z + 1),
    b: getSafe3D(arr, x, y, z - 1)
  };
}

/**
* Given a 2D array 'arr' and a position of a corner, get the height of all adjacent cells around it as an object
* This can be unpacked as follows:
* const { topLeft, topRight, bottomLeft, bottomRight } = context;
*/
export function getCornerContext2x2(arr, x, y) {
  return {
    topLeft: getSafe(arr, x - 1, y),
    topRight: getSafe(arr, x, y),
    bottomLeft: getSafe(arr, x - 1, y - 1),
    bottomRight: getSafe(arr, x, y - 1)
  };
}

/**
 * Returns an empty 2D array
 * @param {int} rows - Number of rows in the array
 * @param {int} columns - Number of columns in the array
 * @param defaultValue - Default value for new array cells
 */
export function getEmpty2DArray(rows, columns, defaultValue = null) {
  const arr = new Array(rows);
  for (let i = 0; i < rows; i += 1) {
    arr[i] = new Array(columns);
    for (let j = 0; j < columns; j += 1) {
      arr[i][j] = defaultValue;
    }
  }
  return arr;
}
