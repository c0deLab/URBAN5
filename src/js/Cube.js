import * as THREE from 'three';
import { createjs } from '@createjs/easeljs';
import CamerasEnum from './enums/CamerasEnum';
import SurfacesEnum from './enums/SurfacesEnum';

/* global SETTINGS */

export default class Cube {
  constructor(position, context) {
    // n, e, s, w, t, b
    this.surfaces = this._getSurfaces(context);
    this.position = position;
  }

  draw2D = (camera, stage, x, y, isDashed = false) => {
    let drawLeft, drawTop, drawRight, drawBottom;
    const s = this.surfaces;
    // Lines on the sides require knowing the camera angle
    switch (camera) {
      case CamerasEnum.NORTH:
        drawLeft = s.w === SurfacesEnum.SOLID;
        drawTop = s.t === SurfacesEnum.SOLID;
        drawRight = s.e === SurfacesEnum.SOLID;
        drawBottom = s.b === SurfacesEnum.SOLID;
        break;
      case CamerasEnum.SOUTH:
        drawLeft = s.e === SurfacesEnum.SOLID;
        drawTop = s.t === SurfacesEnum.SOLID;
        drawRight = s.w === SurfacesEnum.SOLID;
        drawBottom = s.b === SurfacesEnum.SOLID;
        break;
      case CamerasEnum.EAST:
        drawLeft = s.n === SurfacesEnum.SOLID;
        drawTop = s.t === SurfacesEnum.SOLID;
        drawRight = s.s === SurfacesEnum.SOLID;
        drawBottom = s.b === SurfacesEnum.SOLID;
        break;
      case CamerasEnum.WEST:
        drawLeft = s.s === SurfacesEnum.SOLID;
        drawTop = s.t === SurfacesEnum.SOLID;
        drawRight = s.n === SurfacesEnum.SOLID;
        drawBottom = s.b === SurfacesEnum.SOLID;
        break;
      case CamerasEnum.TOP:
        drawLeft = s.w === SurfacesEnum.SOLID;
        drawTop = s.n === SurfacesEnum.SOLID;
        drawRight = s.e === SurfacesEnum.SOLID;
        drawBottom = s.s === SurfacesEnum.SOLID;
        break;
      case CamerasEnum.BOTTOM:
        drawLeft = s.w === SurfacesEnum.SOLID;
        drawTop = s.s === SurfacesEnum.SOLID;
        drawRight = s.e === SurfacesEnum.SOLID;
        drawBottom = s.n === SurfacesEnum.SOLID;
        break;
      default:
        return;
    }

    this._drawSquare(stage, x, y, isDashed, drawLeft, drawTop, drawRight, drawBottom);
  };

  draw3D = scene => {
    const { x, y, z } = this.position;

    const geometry = new THREE.BoxGeometry(SETTINGS.r, SETTINGS.r, SETTINGS.r);
    const wireframe = new THREE.EdgesGeometry(geometry);
    const lines = new THREE.LineSegments(wireframe, SETTINGS.material);
    const position = { x: x * SETTINGS.r, y: z * SETTINGS.r, z: -y * SETTINGS.r };
    lines.position.x = position.x + (SETTINGS.r / 2);
    lines.position.y = position.y + (SETTINGS.r / 2);
    lines.position.z = position.z - (SETTINGS.r / 2);
    scene.add(lines);
  };

  _getSurfaces = context => {
    const surfaces = {
      n: SurfacesEnum.SOLID,
      e: SurfacesEnum.SOLID,
      s: SurfacesEnum.SOLID,
      w: SurfacesEnum.SOLID,
      t: SurfacesEnum.SOLID,
      b: SurfacesEnum.SOLID
    };

    const { n, e, s, w, t, b } = context;
    // Join to adjacent cubes (update both this one and the other)
    if (n && n.constructor.name === 'Cube') {
      surfaces.n = SurfacesEnum.NONE;
      n.surfaces.s = SurfacesEnum.NONE;
    }
    if (e && e.constructor.name === 'Cube') {
      surfaces.e = SurfacesEnum.NONE;
      e.surfaces.w = SurfacesEnum.NONE;
    }
    if (s && s.constructor.name === 'Cube') {
      surfaces.s = SurfacesEnum.NONE;
      s.surfaces.n = SurfacesEnum.NONE;
    }
    if (w && w.constructor.name === 'Cube') {
      surfaces.w = SurfacesEnum.NONE;
      w.surfaces.e = SurfacesEnum.NONE;
    }

    // Join to roof above
    if (t && t.constructor.name === 'Roof') {
      surfaces.t = SurfacesEnum.NONE;
    }

    // Join to adjacent roofs that face this cube
    if (n && n.constructor.name === 'Roof' && n.direction === 'n') {
      surfaces.n = SurfacesEnum.NONE;
      n.hasSideSurface = false;
    }
    if (e && e.constructor.name === 'Roof' && e.direction === 'e') {
      surfaces.e = SurfacesEnum.NONE;
      e.hasSideSurface = false;
    }
    if (s && s.constructor.name === 'Roof' && s.direction === 's') {
      surfaces.s = SurfacesEnum.NONE;
      s.hasSideSurface = false;
    }
    if (w && w.constructor.name === 'Roof' && w.direction === 'w') {
      surfaces.w = SurfacesEnum.NONE;
      w.hasSideSurface = false;
    }

    return surfaces;
  };

  remove = context => {
    // check adjacent cubes and seal them?
    const { n, e, s, w, t, b } = context;
    if (n && n.constructor.name === 'Cube') {
      n.surfaces.s = SurfacesEnum.SOLID;
    }
    if (e && e.constructor.name === 'Cube') {
      e.surfaces.w = SurfacesEnum.SOLID;
    }
    if (s && s.constructor.name === 'Cube') {
      s.surfaces.n = SurfacesEnum.SOLID;
    }
    if (w && w.constructor.name === 'Cube') {
      w.surfaces.e = SurfacesEnum.SOLID;
    }

    // Unjoin to adjacent roofs that face this cube
    if (n && n.constructor.name === 'Roof' && n.direction === 'n') {
      n.hasSideSurface = true;
    }
    if (e && e.constructor.name === 'Roof' && e.direction === 'e') {
      e.hasSideSurface = true;
    }
    if (s && s.constructor.name === 'Roof' && s.direction === 's') {
      s.hasSideSurface = true;
    }
    if (w && w.constructor.name === 'Roof' && w.direction === 'w') {
      w.hasSideSurface = true;
    }
  };

  _drawSquare = (stage, x, y, isDashed = false, drawLeft = true, drawTop = true, drawRight = true, drawBottom = true) => {
    const shape = new createjs.Shape();
    shape.graphics.beginStroke(SETTINGS.color).setStrokeStyle(3);

    const sx = (x * SETTINGS.r) + 1;
    const dx = SETTINGS.r;
    const sy = SETTINGS.h - (y * SETTINGS.r) - 1;
    const dy = -SETTINGS.r;

    if (isDashed) {
      shape.graphics.setStrokeDash([3, 7], 0);
    }

    if (drawLeft) { // left
      shape.graphics.moveTo(sx, sy).lineTo(sx, sy + dy);
    }
    if (drawTop) { // top
      shape.graphics.moveTo(sx, sy + dy).lineTo(sx + dx, sy + dy);
    }
    if (drawRight) { // right
      shape.graphics.moveTo(sx + dx, sy + dy).lineTo(sx + dx, sy);
    }
    if (drawBottom) { // bottom
      shape.graphics.moveTo(sx + dx, sy).lineTo(sx, sy);
    }

    stage.addChild(shape);
  };
}
