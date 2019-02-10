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

