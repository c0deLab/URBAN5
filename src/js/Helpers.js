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
