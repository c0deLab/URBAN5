function getSafe(arr, x, y) {
  if (x >= 0 && arr.length > 0 && arr[0].length && x < arr[0].length && y >= 0 && y < arr.length) {
    return arr[y][x];
  }
  return null;
}

//const { topLeft, top, topRight, left, center, right, bottomLeft, bottom, bottomRight } = context;
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
  }
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
