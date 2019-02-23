import * as THREE from 'three';
import { getEmpty2DArray } from '../helpers/ArrayHelpers';

/* global SETTINGS */

export default class TopoRenderer3D {
  draw = (scene, corners) => {
    if (!corners) {
      return;
    }

    // calculate the corners of all the topography and connect them
    const adjustedCorners = getEmpty2DArray(SETTINGS.xMax + 1, SETTINGS.yMax + 1, null);
    for (let y = 0; y <= SETTINGS.yMax; y += 1) {
      for (let x = 0; x <= SETTINGS.xMax; x += 1) {
        const cornerPoint = { x, y, z: corners[y][x] - 0.5 };
        const adjustedCornerPoint = this._getAdjustedPoint(cornerPoint);
        // Drop the height by half a block
        adjustedCornerPoint.z -= 0.5;
        adjustedCorners[y][x] = adjustedCornerPoint;

        // Connect down and right
        if (y > 0) {
          const downPoint = adjustedCorners[y - 1][x];
          this._addLine(scene, adjustedCornerPoint, downPoint);
        }
        if (x > 0) {
          const leftPoint = adjustedCorners[y][x - 1];
          this._addLine(scene, adjustedCornerPoint, leftPoint);
        }
      }
    }
  }

  _addLine = (scene, p0, p1) => {
    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(p0.x, p0.y, p0.z));
    geometry.vertices.push(new THREE.Vector3(p1.x, p1.y, p1.z));
    const line = new THREE.Line(geometry, SETTINGS.material);
    scene.add(line);
  }

  /**
   * Returns the point adjusted for the 3D world
   * @param {object} p - A 3D point
   */
  _getAdjustedPoint = p => {
    const { x, y, z } = p;
    return { x: x * SETTINGS.r, y: z * SETTINGS.r + (SETTINGS.r / 2), z: -y * SETTINGS.r };
  }
}
