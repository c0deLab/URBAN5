import * as THREE from 'three';
import { createjs } from '@createjs/easeljs';
import CamerasEnum from './enums/CamerasEnum';
import SurfacesEnum from './enums/SurfacesEnum';
import { getOppositeDirection } from './Helpers';

/* global SETTINGS */

export default class Roof {
  constructor(position, direction, context) {
    // north, east, south, west, top, bottom
    this.direction = direction;
    this.position = position;
    this.hasSideSurface = true;
    this._checkJoins(context);
  }

  // Join cube surfaces that connect
  _checkJoins = context => {
    const { n, e, s, w, b } = context;

    // Join to roof above
    if (b && b.constructor.name === 'Cube') {
      b.surfaces.t = SurfacesEnum.NONE;
    }

    // Join to adjacent cubes that face this roof
    if (n && n.constructor.name === 'Cube' && this.direction === 's') {
      n.surfaces.s = SurfacesEnum.NONE;
      this.hasSideSurface = false;
    }
    if (e && e.constructor.name === 'Cube' && this.direction === 'w') {
      e.surfaces.w = SurfacesEnum.NONE;
      this.hasSideSurface = false;
    }
    if (s && s.constructor.name === 'Cube' && this.direction === 'n') {
      s.surfaces.n = SurfacesEnum.NONE;
      this.hasSideSurface = false;
    }
    if (w && w.constructor.name === 'Cube' && this.direction === 'e') {
      w.surfaces.e = SurfacesEnum.NONE;
      this.hasSideSurface = false;
    }

    // Join to adjacent roofs
    if (n && (n.constructor.name === 'Roof' && n.direction === 'n') && this.direction === 's') {
      n.hasSideSurface = false;
      this.hasSideSurface = false;
    }
    if (e && (e.constructor.name === 'Roof' && e.direction === 'e') && this.direction === 'w') {
      e.hasSideSurface = false;
      this.hasSideSurface = false;
    }
    if (s && (s.constructor.name === 'Roof' && s.direction === 's') && this.direction === 'n') {
      s.hasSideSurface = false;
      this.hasSideSurface = false;
    }
    if (w && (w.constructor.name === 'Roof' && w.direction === 'w') && this.direction === 'e') {
      w.hasSideSurface = false;
      this.hasSideSurface = false;
    }
  };

  remove = context => {
    const { n, e, s, w, b } = context;
    // Unjoin adjacent cubes
    if (b && b.constructor.name === 'Cube') {
      b.surfaces.t = SurfacesEnum.SOLID;
    }
    if (n && n.constructor.name === 'Cube' && this.direction === 's') {
      n.surfaces.s = SurfacesEnum.SOLID;
    }
    if (e && e.constructor.name === 'Cube' && this.direction === 'w') {
      e.surfaces.w = SurfacesEnum.SOLID;
    }
    if (s && s.constructor.name === 'Cube' && this.direction === 'n') {
      s.surfaces.n = SurfacesEnum.SOLID;
    }
    if (w && w.constructor.name === 'Cube' && this.direction === 'e') {
      w.surfaces.e = SurfacesEnum.SOLID;
    }

    // Unjoin adjacent roofs
    if (n && (n.constructor.name === 'Roof' && n.direction === 'n') && this.direction === 's') {
      n.hasSideSurface = true;
    }
    if (e && (e.constructor.name === 'Roof' && e.direction === 'e') && this.direction === 'w') {
      e.hasSideSurface = true;
    }
    if (s && (s.constructor.name === 'Roof' && s.direction === 's') && this.direction === 'n') {
      s.hasSideSurface = true;
    }
    if (w && (w.constructor.name === 'Roof' && w.direction === 'w') && this.direction === 'e') {
      w.hasSideSurface = true;
    }
  };

  setSurface = (sideCardinal, surface) => {
    if (surface === SurfacesEnum.NONE) {
      switch (sideCardinal) {
        case 'n':
          if (this.direction === 's') {
            this.hasSideSurface = false;
          }
          break;
        case 's':
          if (this.direction === 'n') {
            this.hasSideSurface = false;
          }
          break;
        case 'e':
          if (this.direction === 'w') {
            this.hasSideSurface = false;
          }
          break;
        case 'w':
          if (this.direction === 'e') {
            this.hasSideSurface = false;
          }
          break;
        default:
          break;
      }
    }
  };

  draw2D = (camera, stage, x, y, isDashed = false) => {
    switch (camera) {
      case CamerasEnum.NORTH:
        if (this.direction === 'n' || this.direction === 's') {
          this._drawSquare(stage, x, y, isDashed);
        } else if (this.direction === 'w') {
          this._drawRoofSlantLeft(stage, x, y, isDashed);
        } else if (this.direction === 'e') {
          this._drawRoofSlantRight(stage, x, y, isDashed);
        }
        break;
      case CamerasEnum.SOUTH:
        if (this.direction === 'n' || this.direction === 's') {
          this._drawSquare(stage, x, y, isDashed);
        } else if (this.direction === 'e') {
          this._drawRoofSlantLeft(stage, x, y, isDashed);
        } else if (this.direction === 'w') {
          this._drawRoofSlantRight(stage, x, y, isDashed);
        }
        break;
      case CamerasEnum.EAST:
        if (this.direction === 'e' || this.direction === 'w') {
          this._drawSquare(stage, x, y, isDashed);
        } else if (this.direction === 's') {
          this._drawRoofSlantRight(stage, x, y, isDashed);
        } else if (this.direction === 'n') {
          this._drawRoofSlantLeft(stage, x, y, isDashed);
        }
        break;
      case CamerasEnum.WEST:
        if (this.direction === 'e' || this.direction === 'w') {
          this._drawSquare(stage, x, y, isDashed);
        } else if (this.direction === 'n') {
          this._drawRoofSlantRight(stage, x, y, isDashed);
        } else if (this.direction === 's') {
          this._drawRoofSlantLeft(stage, x, y, isDashed);
        }
        break;
      case CamerasEnum.TOP:
      case CamerasEnum.BOTTOM:
        this._drawSquare(stage, x, y, isDashed);
        break;
      default:
    }
  };

  draw3D = scene => {
    const lines = this._getRoof();

    const position = { x: this.position.x * SETTINGS.r, y: this.position.z * SETTINGS.r, z: -this.position.y * SETTINGS.r };

    switch (this.direction) {
      case 'n':
        break;
      case 'e':
        lines.rotation.y = Math.PI * 1.5;
        position.z -= SETTINGS.r;
        break;
      case 's':
        lines.rotation.y = Math.PI;
        position.x += SETTINGS.r;
        position.z -= SETTINGS.r;
        break;
      case 'w':
        lines.rotation.y = Math.PI * 0.5;
        position.x += SETTINGS.r;
        break;
      default:
        return;
    }
    lines.position.x = position.x;
    lines.position.y = position.y;
    lines.position.z = position.z;
    scene.add(lines);
  };

  _drawSquare = (stage, x, y, isDashed = false) => {
    const shape = new createjs.Shape();
    shape.graphics.beginStroke(SETTINGS.color).setStrokeStyle(3);

    const sx = (x * SETTINGS.r) + 1;
    const dx = SETTINGS.r;
    const sy = SETTINGS.h - (y * SETTINGS.r) - 1;
    const dy = -SETTINGS.r;

    if (isDashed) {
      shape.graphics.setStrokeDash([3, 7], 0);
    }

    shape.graphics.drawRect(sx, sy, dx, dy);
    stage.addChild(shape);
  };

  /**
   * Draw a line that slants down to the left
   * @param {int} x
   * @param {int} y
   */
  _drawRoofSlantLeft = (stage, x, y, isDashed = false) => {
    const roof = new createjs.Shape();

    if (isDashed) {
      roof.graphics.setStrokeDash([3, 8.5], 0);
    }

    let cornerX = (x * SETTINGS.r) + 1;
    let cornerY = SETTINGS.h - (y * SETTINGS.r) - 1;
    roof.graphics.beginStroke(SETTINGS.color).setStrokeStyle(3);
    roof.graphics.moveTo(cornerX, cornerY);
    cornerX += SETTINGS.r;
    cornerY -= SETTINGS.r;
    roof.graphics.lineTo(cornerX, cornerY);

    if (this.hasSideSurface) {
      roof.graphics.moveTo(cornerX, cornerY);
      cornerY += SETTINGS.r;
      roof.graphics.lineTo(cornerX, cornerY);
    }
    roof.graphics.endStroke();

    stage.addChild(roof);
  };

  /**
   * Draw a line that slants down to the right
   * @param {int} x
   * @param {int} y
   */
  _drawRoofSlantRight = (stage, x, y, isDashed = false) => {
    const roof = new createjs.Shape();

    if (isDashed) {
      roof.graphics.setStrokeDash([3, 8.5], 0);
    }

    let cornerX = (x * SETTINGS.r) + 1;
    let cornerY = SETTINGS.h - ((y + 1) * SETTINGS.r) - 1;
    roof.graphics.beginStroke(SETTINGS.color).setStrokeStyle(3);
    roof.graphics.moveTo(cornerX, cornerY);
    cornerX += SETTINGS.r;
    cornerY += SETTINGS.r;
    roof.graphics.lineTo(cornerX, cornerY);

    if (this.hasSideSurface) {
      cornerX -= SETTINGS.r;
      cornerY -= SETTINGS.r;
      roof.graphics.moveTo(cornerX, cornerY);
      cornerY += SETTINGS.r;
      roof.graphics.lineTo(cornerX, cornerY);
    }
    roof.graphics.endStroke();

    stage.addChild(roof);
  };

  _getRoof = () => {
    const geometry = new THREE.Geometry();

    if (this.hasSideSurface) {
      geometry.vertices.push(
        // tall face bottom
        new THREE.Vector3(0, SETTINGS.r, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(SETTINGS.r, 0, 0),
        new THREE.Vector3(SETTINGS.r, 0, 0),
        new THREE.Vector3(SETTINGS.r, SETTINGS.r, 0),
      );
    }

    geometry.vertices.push(
      // slanted face
      new THREE.Vector3(0, 0, -SETTINGS.r),
      new THREE.Vector3(0, SETTINGS.r, 0),
      new THREE.Vector3(0, SETTINGS.r, 0),
      new THREE.Vector3(SETTINGS.r, SETTINGS.r, 0),
      new THREE.Vector3(SETTINGS.r, SETTINGS.r, 0),
      new THREE.Vector3(SETTINGS.r, 0, -SETTINGS.r),
      new THREE.Vector3(SETTINGS.r, 0, -SETTINGS.r),
      new THREE.Vector3(0, 0, -SETTINGS.r),
    );

    const lines = new THREE.LineSegments(geometry, SETTINGS.material);

    return lines;
  }
}
