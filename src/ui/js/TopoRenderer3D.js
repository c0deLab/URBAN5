import * as THREE from 'three';
import { getEmpty2DArray } from '../../helpers/Helpers';
import CamerasEnum from '../../api/enums/CamerasEnum';

/* global SETTINGS */

export default class TopoRenderer3D {
  draw = (scene, corners, cameraView) => {
    if (!corners) {
      return;
    }

    // Add code for debugger to mark current camera view
    if (cameraView) {
      const pointLists = this._getArrows(cameraView);
      this._addArrows(scene, pointLists);
    }
    const isDebug = !!cameraView;

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
          this._addLine(scene, adjustedCornerPoint, downPoint, isDebug);
        }
        if (x > 0) {
          const leftPoint = adjustedCorners[y][x - 1];
          this._addLine(scene, adjustedCornerPoint, leftPoint, isDebug);
        }
      }
    }
  }

  _addArrows = (scene, pointLists) => {
    pointLists.forEach(points => {
      const geometry = new THREE.Geometry();
      points.forEach(p => {
        const adjP = this._getAdjustedPoint(p);
        const { x, y, z } = adjP;
        geometry.vertices.push(new THREE.Vector3(x, y, z));
      });
      const arrow = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x00EE00 }));
      scene.add(arrow);
    });
  }

  _getArrows = cameraView => {
    let { x, y, z } = cameraView.slices;
    let pointLists;

    switch (cameraView.camera) {
      case CamerasEnum.TOP:
      case CamerasEnum.BOTTOM:
        pointLists = [
          [{ x: -1, y: 0, z }, { x: 0, y: 0, z }, { x: 0, y: -1, z }, { x: -1, y: 0, z }],
          [{ x: SETTINGS.xMax + 1, y: SETTINGS.yMax, z }, { x: SETTINGS.xMax, y: SETTINGS.yMax, z }, { x: SETTINGS.xMax, y: SETTINGS.yMax + 1, z }, { x: SETTINGS.xMax + 1, y: SETTINGS.yMax, z }],
          [{ x: SETTINGS.xMax + 1, y: 0, z }, { x: SETTINGS.xMax, y: 0, z }, { x: SETTINGS.xMax, y: -1, z }, { x: SETTINGS.xMax + 1, y: 0, z }],
          [{ x: -1, y: SETTINGS.yMax, z }, { x: 0, y: SETTINGS.yMax, z }, { x: 0, y: SETTINGS.yMax + 1, z }, { x: -1, y: SETTINGS.yMax, z }],
        ];
        break;
      case CamerasEnum.WEST:
        x -= 0.5;
        pointLists = [
          [{ x: x + 1, y: -1, z: -0.5 }, { x, y: -0.5, z: -0.5 }, { x: x + 1, y: 0, z: -0.5 }, { x: x + 1, y: -1, z: -0.5 }],
          [{ x: x + 1, y: SETTINGS.yMax + 1, z: -0.5 }, { x, y: SETTINGS.yMax + 0.5, z: -0.5 }, { x: x + 1, y: SETTINGS.yMax, z: -0.5 }, { x: x + 1, y: SETTINGS.yMax + 1, z: -0.5 }]
        ];
        break;
      case CamerasEnum.EAST:
        x += 0.5;
        pointLists = [
          [{ x, y: -1, z: -0.5 }, { x: x + 1, y: -0.5, z: -0.5 }, { x, y: 0, z: -0.5 }, { x, y: -1, z: -0.5 }],
          [{ x, y: SETTINGS.yMax + 1, z: -0.5 }, { x: x + 1, y: SETTINGS.yMax + 0.5, z: -0.5 }, { x, y: SETTINGS.yMax, z: -0.5 }, { x, y: SETTINGS.yMax + 1, z: -0.5 }]
        ];
        break;
      case CamerasEnum.NORTH:
        y += 0.5;
        pointLists = [
          [{ x: -1, y, z: -0.5 }, { x: -0.5, y: y + 1, z: -0.5 }, { x: 0, y, z: -0.5 }, { x: -1, y, z: -0.5 }],
          [{ x: SETTINGS.xMax + 1, y, z: -0.5 }, { x: SETTINGS.xMax + 0.5, y: y + 1, z: -0.5 }, { x: SETTINGS.xMax, y, z: -0.5 }, { x: SETTINGS.xMax + 1, y, z: -0.5 }]
        ];
        break;
      case CamerasEnum.SOUTH:
        y -= 0.5;
        pointLists = [
          [{ x: -1, y: y + 1, z: -0.5 }, { x: -0.5, y, z: -0.5 }, { x: 0, y: y + 1, z: -0.5 }, { x: -1, y: y + 1, z: -0.5 }],
          [{ x: SETTINGS.xMax + 1, y: y + 1, z: -0.5 }, { x: SETTINGS.xMax + 0.5, y, z: -0.5 }, { x: SETTINGS.xMax, y: y + 1, z: -0.5 }, { x: SETTINGS.xMax + 1, y: y + 1, z: -0.5 }]
        ];
        break;
      default:
        pointLists = [];
        break;
    }

    return pointLists;
  }

  _addLine = (scene, p0, p1, isDebug) => {
    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(p0.x, p0.y, p0.z));
    geometry.vertices.push(new THREE.Vector3(p1.x, p1.y, p1.z));

    let line;
    if (isDebug) {
      line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x666666 }));
    } else {
      line = new THREE.Line(geometry, SETTINGS.material);
    }

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
