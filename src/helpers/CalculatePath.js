const PF = require('pathfinding');

/* global SETTINGS */

// Calculate the 2D path along the ground that avoids objects, but can pass through walls (except on slopes)
function getPathWithWallOpenings(session, start, end) {
  // Make grid square 3x3 so that openings can exist in walls
  const grid = new PF.Grid(SETTINGS.xMax * 3, SETTINGS.yMax * 3);

  const topoCorners = session.topo.getCorners();

  // get all the objects at ground level
  for (let y = 0; y < SETTINGS.yMax; y += 1) {
    for (let x = 0; x < SETTINGS.xMax; x += 1) {
      const adjX = Math.floor(x);
      const adjY = Math.floor(y);
      const z = session.topo.getAt({ x: adjX, y: adjY });

      const cornerZ = Math.max(topoCorners[y][x], topoCorners[y][x + 1], topoCorners[y + 1][x], topoCorners[y + 1][x + 1]);
      if (z !== cornerZ) {
        console.log('z comp', z, cornerZ);
        // If you are on slope, check for all objects on slope
        let isObjectInWay = false;
        for (let h = z; h < cornerZ + 1; h += 1) {
          const object = session.design.getAt({ x: adjX, y: adjY, z: h });
          if (object) {
            isObjectInWay = true;
          }
        }

        if (isObjectInWay) {
          // fill in all squares
          grid.setWalkableAt(x * 3, y * 3, false);
          grid.setWalkableAt((x * 3) + 2, y * 3, false);
          grid.setWalkableAt((x * 3) + 2, (y * 3) + 2, false);
          grid.setWalkableAt(x * 3, (y * 3) + 2, false);
          grid.setWalkableAt(x * 3, (y * 3) + 1, false);
          grid.setWalkableAt((x * 3) + 2, (y * 3) + 1, false);
          grid.setWalkableAt((x * 3) + 1, (y * 3) + 2, false);
          grid.setWalkableAt((x * 3) + 1, y * 3, false);
        }
      } else {
        // on flat ground, just check current object, allowing to pass through walls of cube
        const object = session.design.getAt({ x: adjX, y: adjY, z });
        if (object) {
          // fill in corners
          grid.setWalkableAt(x * 3, y * 3, false);
          grid.setWalkableAt((x * 3) + 2, y * 3, false);
          grid.setWalkableAt((x * 3) + 2, (y * 3) + 2, false);
          grid.setWalkableAt(x * 3, (y * 3) + 2, false);

          // if cube check walls
          if (object.constructor.typeName === 'CUBE') {
            if (!object.hasAccessInDirection('w')) {
              grid.setWalkableAt(x * 3, (y * 3) + 1, false);
            }
            if (!object.hasAccessInDirection('e')) {
              grid.setWalkableAt((x * 3) + 2, (y * 3) + 1, false);
            }
            if (!object.hasAccessInDirection('n')) {
              grid.setWalkableAt((x * 3) + 1, (y * 3) + 2, false);
            }
            if (!object.hasAccessInDirection('s')) {
              grid.setWalkableAt((x * 3) + 1, y * 3, false);
            }
          } else {
            // else, fill in walls
            grid.setWalkableAt(x * 3, (y * 3) + 1, false);
            grid.setWalkableAt((x * 3) + 2, (y * 3) + 1, false);
            grid.setWalkableAt((x * 3) + 1, (y * 3) + 2, false);
            grid.setWalkableAt((x * 3) + 1, y * 3, false);
          }
        }
      }
    }
  }

  const finder = new PF.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true
  });
  let path = finder.findPath((start.x * 3) + 1, (start.y * 3) + 1, (end.x * 3) + 1, (end.y * 3) + 1, grid);
  // get every third and adjust
  const adjPath = [];
  let currX = null;
  let currY = null;
  for (let i = 0; i < path.length; i += 1) {
    const [x, y] = path[i];
    const adjX = Math.floor(x / 3);
    const adjY = Math.floor(y / 3);
    if (adjX !== currX || adjY !== currY) {
      currX = adjX;
      currY = adjY;
      // new point
      adjPath.push({ x: currX, y: currY });
    }
  }

  return adjPath;
}

// Given a path, interpolate between the points with a given number of steps per point
function smoothPath(path, steps) {
  if (steps > 1 && path.length < 2) {
    return path;
  }

  const smoothedPath = [];
  for (let i = 1; i < path.length; i += 1) {
    const start = path[i - 1];
    const end = path[i];

    const dx = (end.x - start.x) / steps;
    const dy = (end.y - start.y) / steps;
    const dz = (end.z - start.z) / steps;
    for (let s = 0; s < steps; s += 1) {
      const x = start.x + (s * dx);
      const y = start.y + (s * dy);
      const z = start.z + (s * dz);

      smoothedPath.push({ x, y, z });
    }
  }
  smoothedPath.push(path[path.length - 1]);

  return smoothedPath;
}

// Add a random xNoise and yNoise within the given range in place to the path
function addNoise(path, range) {
  for (let i = 1; i < path.length - 1; i += 1) {
    const xNoise = (Math.random() * 2 * range) - range;
    const yNoise = (Math.random() * 2 * range) - range;
    const p = path[i];
    p.xNoise = p.x + xNoise;
    p.yNoise = p.y + yNoise;
  }
}

// Given a start and end point, navigate through the design along the ground
// The path goes around objects, but can pass through walls (except on hills)
export default function calculatePath(session, start, end) {
  const path = getPathWithWallOpenings(session, start, end);

  // make 3D
  const path3D = path.map(p => {
    const { x, y } = p;
    const z = session.topo.getAt({ x, y });
    return { x, y, z };
  });

  // smooth path
  const smoothedPath = smoothPath(path3D, 3);

  // Add noise (except for start and last spot)
  const range = 0.1;
  addNoise(smoothedPath, range);

  return smoothedPath;
}
