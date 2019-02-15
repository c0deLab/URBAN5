import * as THREE from 'three';
import { createjs } from '@createjs/easeljs';
import CamerasEnum from './enums/CamerasEnum';

/* global SETTINGS */

export class Foliage {
  constructor(position) {
    this.position = position;
  }

  /**
   * Draws the circle representing foliage of a tree at the given x and y.
   * @param {int} x
   * @param {int} y
   */
  draw2D = (camera, stage, x, y, isDashed = false) => {
    const foliage = new createjs.Shape();

    if (isDashed) {
      foliage.graphics.setStrokeDash([SETTINGS.stroke, 7], 0);
    }

    foliage.graphics.beginStroke(SETTINGS.color).setStrokeStyle(SETTINGS.stroke);
    const cornerX = ((x + 0.5) * SETTINGS.r) + 1;
    const cornerY = SETTINGS.h - ((y + 0.45) * SETTINGS.r) - 1;
    foliage.graphics.drawCircle(cornerX, cornerY, SETTINGS.r * 0.40);

    stage.addChild(foliage);
  };

  draw3D = scene => {
    const { x, y, z } = this.position;
    const geometry = new THREE.SphereGeometry(SETTINGS.r / 2, 5, 5);
    const wireframe = new THREE.EdgesGeometry(geometry);
    const lines = new THREE.LineSegments(wireframe, SETTINGS.material);
    const position = { x: x * SETTINGS.r, y: z * SETTINGS.r, z: -y * SETTINGS.r };
    lines.position.x = position.x + (SETTINGS.r / 2);
    lines.position.y = position.y + (SETTINGS.r / 2);
    lines.position.z = position.z - (SETTINGS.r / 2);
    scene.add(lines);
  };
}

export class Trunk {
  constructor(position) {
    this.position = position;
  }

  /**
   * Draws the trunk of a tree at the given x and y.
   * @param {int} x
   * @param {int} y
   * @param {boolean} isDashed - Whether the lines should be dashed or not
   */
  draw2D = (camera, stage, x, y, isDashed = false) => {
    const trunk = new createjs.Shape();

    if (isDashed) {
      trunk.graphics.setStrokeDash([4, 8], 0);
    }

    trunk.graphics.beginStroke(SETTINGS.color).setStrokeStyle(SETTINGS.stroke);
    let cornerX = ((x + 0.5) * SETTINGS.r) + 1;
    let cornerY = SETTINGS.h - (y * SETTINGS.r) - 1;

    // The trunk is a rectangle from the side and a dot from the ends
    switch (camera) {
      case CamerasEnum.NORTH:
      case CamerasEnum.SOUTH:
      case CamerasEnum.WEST:
      case CamerasEnum.EAST:
        // Draw a line
        trunk.graphics.moveTo(cornerX, cornerY).lineTo(cornerX, cornerY - SETTINGS.r);
        break;
      case CamerasEnum.TOP:
      case CamerasEnum.BOTTOM:
        // Draw no point, because grid point
        break;
      default:
        throw new Error(`camera ${camera} is not recognized!`);
    }

    stage.addChild(trunk);
  };

  draw3D = scene => {
    const { x, y, z } = this.position;
    const position = { x: (x + 0.5) * SETTINGS.r, y: z * SETTINGS.r, z: (-y - 0.5) * SETTINGS.r };
    const position2 = { x: position.x, y: position.y + SETTINGS.r, z: position.z };
    this._addLine(scene, position, position2);
  };

  _addLine = (scene, p0, p1) => {
    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(p0.x, p0.y, p0.z));
    geometry.vertices.push(new THREE.Vector3(p1.x, p1.y, p1.z));
    const line = new THREE.Line(geometry, SETTINGS.material);
    scene.add(line);
  }
}
