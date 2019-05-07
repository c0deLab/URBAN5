import { getOppositeDirection } from './Helpers';
import { getEmpty2DArray } from './ArrayHelpers';

/* global SETTINGS */

  // const steps = 15;
  // const dx = (end.x - start.x) / steps;
  // const dy = (end.y - start.y) / steps;
  // path = [];
  // for (let i = 0; i < steps; i += 1) {
  //   const x = start.x + (i * dx);
  //   const y = start.y + (i * dy);
  //   const z = session.topo.getAt({ x: Math.round(x), y: Math.round(y) });
  //   path.push({ x, y, z });
  // }
  // console.log('path', path);
  // return path;

  // let path = null;

  // if (path) {
  //   return path;
  // } else {
  //   const steps = 15;
  //   const dx = (end.x - start.x) / steps;
  //   const dy = (end.y - start.y) / steps;
  //   path = [];
  //   for (let i = 0; i < steps; i += 1) {
  //     const x = start.x + (i * dx);
  //     const y = start.y + (i * dy);
  //     const z = session.topo.getAt({ x: Math.round(x), y: Math.round(y) });
  //     path.push({ x, y, z });
  //   }
  //   console.log('path', path);
  //   return path;
  // }

function isLegalStep(session, prev, curr) {
  const x = Math.round(curr.x);
  const y = Math.round(curr.y);
  const z = Math.round(curr.z);

  const hasObject = !!session.design.getAt({ x, y, z });
  return !hasObject;
}

function getDirectPath(session, start, end, stepRate) {
  const distance = Math.sqrt(((start.x - end.x) ** 2) + ((start.y - end.y) ** 2));
  const steps = (distance * stepRate) + 1;
  const dx = (end.x - start.x) / (steps  - 1);
  const dy = (end.y - start.y) / (steps - 1);
  const path = [];
  for (let i = 0; i < steps; i += 1) {
    const x = start.x + (i * dx);
    const y = start.y + (i * dy);

    path.push({ x, y });
  }

  // Add smoothed z's
  for (let i = 0; i < steps; i += 1) {
    let totZ = 0;
    let zCount = 0;
    if (i > 0) {
      totZ += session.topo.getAt({ x: Math.round(path[i - 1].x), y: Math.round(path[i - 1].y) });
      zCount += 1;
    }
    totZ += session.topo.getAt({ x: Math.round(path[i].x), y: Math.round(path[i].y) });
    zCount += 1;
    if (i < steps - 1) {
      totZ += session.topo.getAt({ x: Math.round(path[i + 1].x), y: Math.round(path[i + 1].y) });
      zCount += 1;
    }

    path[i].z = totZ / zCount;
  }
  return path;
}

function isDirectionPossibleMove(session, current, adj, direction) {
  const currentCube = session.design.getAt(current);
  const inCube = !!currentCube;

  // not in cube or in cube and side has no surface
  if (!inCube || currentCube.hasAccessInDirection(direction)) {
    // check if open
    if (current.z === adj.z) {
      const adjCube = session.design.getAt(adj);
      const adjIsCube = !!adjCube;
      // same height, check if no cube or cube with empty surface
      const adjKey = getOppositeDirection(direction);
      if (!adjIsCube || adjCube.hasAccessInDirection(adjKey)) {
        // can go this direction
        return true;
      }
    } else {
      // not same height
      // check if no objects between current height and adjacent height in adjacent column
      const delta = adj.z < current.z ? 1 : -1;
      let isObjectInWay = false;
      for (let z = adj.z; z <= current.z; z += delta) {
        const toCheck = { x: adj.x, y: adj.y, z };
        const toCheckObject = session.design.getAt(toCheck);
        if (toCheckObject) {
          isObjectInWay = true;
        }
      }

      if (!isObjectInWay) {
        // can go this direction
        return true;
      }
    }
  }

  return false;
}

function getAdjacents(session, p) {
  const adjacents = {};
  if (p.x > 0) {
    adjacents.w = { x: p.x - 1, y: p.y };
  }
  if (p.x < SETTINGS.xMax - 1) {
    adjacents.e = { x: p.x + 1, y: p.y };
  }
  if (p.y > 0) {
    adjacents.s = { x: p.x, y: p.y - 1 };
  }
  if (p.y < SETTINGS.yMax - 1) {
    adjacents.n = { x: p.x, y: p.y + 1 };
  }

  Object.keys(adjacents).forEach(key => {
    const adj = adjacents[key];
    adj.z = session.topo.getAt(adj);
  });

  return adjacents;
}

function isPointEqual(p0, p1) {
  if (p0.x === p1.x && p0.y === p1.y && p0.z === p1.z) {
    return true;
  }
  return false;
}

function pointListContains(list, p) {
  let contains = false;
  list.forEach(i => {
    if (isPointEqual(i, p)) {
      contains = true;
    }
  });
  return contains;
}

function getFloodFillMap(session, start) {
  const startZ = session.topo.getAt(start);
  const origin = { x: start.x, y: start.y, z: startZ, dist: 0 };
  // Map of fastest accessible route to origin
  const floodFillMapDist = getEmpty2DArray(SETTINGS.yMax, SETTINGS.xMax);
  const floodFillMapParents = getEmpty2DArray(SETTINGS.yMax, SETTINGS.xMax);
  const possibleMoves = [origin];
  const visited = [];
  let current;
  let adjacents;

  while (possibleMoves.length > 0) {
    // check current
    current = possibleMoves.shift();
    visited.push(current);
    floodFillMapDist[current.y][current.x] = current.dist;
    floodFillMapParents[current.y][current.x] = current.parent;
    adjacents = getAdjacents(session, current);

    Object.keys(adjacents).forEach(direction => { // eslint-disable-line
      const adj = adjacents[direction];
      const isPossibleMove = isDirectionPossibleMove(session, current, adj, direction);

      if (isPossibleMove && !pointListContains(possibleMoves, adj) && !pointListContains(visited, adj)) {
        adj.dist = current.dist + 1;
        adj.parent = current;
        possibleMoves.push(adj);
      }
    });
  }

  return { floodFillMapDist, floodFillMapParents };
}

// function tryDirectPath(session, legalPath, start, end, stepRate) {
//   const directPath = getDirectPath(session, start, end, stepRate);
//   for (let i = 1; i < directPath.length; i += 1) {
//     const curr = directPath[i];
//     const prev = directPath[i - 1];
//     if (isLegalStep(session, prev, curr)) {
//       legalPath.push(curr);
//     } else {
//       return prev;
//     }
//   }
//   return end;
// }

function followPathUntilBad(directPath, floodFillMap) {
  let lastDist = Infinity;
  const pathSection = [];
  let currIndex = 0;
  while (currIndex < directPath.length) {
    const currPos = directPath[currIndex];
    const currDist = floodFillMap[Math.floor(currPos.x)][Math.floor(currPos.y)];
    if (currDist <= lastDist) {
      pathSection.push(currPos);
    } else {
      // encountered bad path
      return pathSection;
    }

    currIndex += 1;
    lastDist = currDist;
  }
  // at end
  return pathSection;
}

function findLegalPath(session, start, end) {
  console.log('start', start, 'end', end);
  const { floodFillMapDist, floodFillMapParents } = getFloodFillMap(session, end);
  console.table(floodFillMapDist);

  // try direct path
  const stepRate = 2;
  const legalPath = [];
  let currPos = start;
  let i = 0;
  while (i < 2) {
    // follow directpath while moves keep same distance or less
    const directPath = getDirectPath(session, start, end, stepRate);
    const pathSection = followPathUntilBad(directPath, floodFillMapDist);
    console.log('pathSection', pathSection);
    legalPath.push(...pathSection);

    // at end?
    currPos = legalPath[legalPath.length - 1];
    if (isPointEqual(currPos, end)) {
      return legalPath;
    }

    // go to parent of last spot
    const goodNeighber = floodFillMapParents[currPos.x][currPos.y];
    const pathToGoodNeighbor = getDirectPath(session, currPos, goodNeighber, stepRate);
    console.log('pathToGoodNeighbor', pathToGoodNeighbor);
    legalPath.push(...pathToGoodNeighbor);

    // at end?
    currPos = legalPath[legalPath.length - 1];
    if (isPointEqual(currPos, end)) {
      return legalPath;
    }
    i += 1;
  }

  return null;
}

export default function calculatePath(session, start, end) {
  const start3D = { x: start.x, y: start.y };
  const end3D = { x: end.x, y: end.y };
  start3D.z = session.topo.getAt(start);
  end3D.z = session.topo.getAt(end);

  // const legalPath = findLegalPath(session, start3D, end3D);
  // if (!legalPath) {
  //   return legalPath;
  // }
  const legalPath = getDirectPath(session, start, end, 2);

  // Add noise (except for start and last spot)
  const range = 0.15;
  for (let i = 1; i < legalPath.length - 1; i += 1) {
    const xNoise = (Math.random() * 2 * range) - range;
    const yNoise = (Math.random() * 2 * range) - range;
    const p = legalPath[i];
    p.xNoise = p.x + xNoise;
    p.yNoise = p.y + yNoise;
  }

  return legalPath;
}
