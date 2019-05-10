/* global SETTINGS */

/**
 * Returns a 3D vector of the model position based on the normalized click
 * @param {float} clickX - Normalized x between 0 and 1
 * @param {float} clickY - Normalized y between 0 and 1
 */
export function getRelativePosition(clickX, clickY) {
  // get the x, y position in the scale of the model
  const { gridSize } = SETTINGS;
  const x = Math.floor(clickX * gridSize);
  const y = gridSize - 1 - Math.floor(clickY * gridSize);
  return { x, y };
}

export function getGridPointInModelSpace(x, y) {
  const { w, h } = SETTINGS;
  // There is a 1px padding around the edges to not cut off the graphics awkwardly
  // Ignore clicks in that range
  if (x === 0 || x === (w - 1)
      || y === 0 || y === (h - 1)) {
    return null;
  }

  // Offset click for 1px padding and find normalized position
  const normalizedX = (x - 1) / w;
  const normalizedY = (y - 1) / h;
  const point = getRelativePosition(normalizedX, normalizedY);

  return point;
}

export function getClosestEdgeInModelSpace(clickX, clickY) {
  const { w, h, gridSize } = SETTINGS;
  // There is a 1px padding around the edges to not cut off the graphics awkwardly
  // Ignore clicks in that range
  if (clickX === 0 || clickX === (w - 1)
      || clickY === 0 || clickY === (h - 1)) {
    return null;
  }

  // Offset click for 1px padding and find normalized position
  const normalizedX = (clickX - 1) / w;
  const normalizedY = (clickY - 1) / h;

  const x = normalizedX * gridSize;
  const xRound = Math.floor(x);
  const xRemainder = x - xRound;

  const y = gridSize - (normalizedY * gridSize);
  const yRound = Math.floor(y);
  const yRemainder = y - yRound;

  let side;
  const tDist = 1 - yRemainder;
  const bDist = yRemainder;
  const lDist = xRemainder;
  const rDist = 1 - xRemainder;
  const max = Math.min(tDist, bDist, lDist, rDist);
  if (tDist === max) {
    side = 't';
  } else if (bDist === max) {
    side = 'b';
  } else if (lDist === max) {
    side = 'l';
  } else if (rDist === max) {
    side = 'r';
  }

  return { x: xRound, y: yRound, side };
}

export function getOppositeDirection(cardinalDirection) {
  switch (cardinalDirection) {
    case 'n':
      return 's';
    case 's':
      return 'n';
    case 'e':
      return 'w';
    case 'w':
      return 'e';
    case 't':
      return 'b';
    case 'b':
      return 't';
    default:
      return null;
  }
}

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

export function getEmpty3DArray(x, y, z) {
  const arr = new Array(z);

  for (let i = 0; i < arr.length; i += 1) {
    arr[i] = getEmpty2DArray(y, x, null);
  }

  return arr;
}
