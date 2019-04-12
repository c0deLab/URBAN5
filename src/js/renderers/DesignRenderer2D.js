import { createjs } from '@createjs/easeljs';
import CamerasEnum from '../enums/CamerasEnum';
import SurfacesEnum from '../enums/SurfacesEnum';

/* global SETTINGS */

/** Class responsible for rendering a 2D slice */
export default class DesignRenderer2D {
  constructor(stage) {
    this.stage = stage;
  }

  /**
   * Add a slice to the view
   * @param {int} camera - CamerasEnum
   * @param {int[][]} slice - 2D array representing slice to add
   * @param {boolean} isDashed - Whether the lines should be dashed or not
   */
  drawSlice = (camera, slice, isDashed = false) => {
    this.camera = camera;
    for (let y = 0; y < slice.length; y += 1) {
      const row = slice[y];
      for (let x = 0; x < row.length; x += 1) {
        const cell = row[x];

        if (cell) {
          switch (cell.constructor.name) {
            case 'Cube':
              this.drawCube(cell, camera, this.stage, x, y, isDashed);
              break;
            case 'Roof':
              this.drawRoof(cell, camera, this.stage, x, y, isDashed);
              break;
            case 'Foliage':
              // Dont draw background trees
              if (!isDashed) {
                this.drawFoliage(camera, this.stage, x, y, isDashed);
              }
              break;
            case 'Trunk':
              // Dont draw background trees
              if (!isDashed) {
                this.drawTrunk(camera, this.stage, x, y, isDashed);
              }
              break;
            default:
              break;
          }
        }
      }
    }
  };

  /**
   * Draw points that match the size of the current slice
   * @param {int[][]} slice - 2D array representing slice to add
   */
  drawGridPoints = slice => {
    for (let y = 0; y < slice.length; y += 1) {
      const row = slice[y];
      for (let x = 0; x < row.length; x += 1) {
        const point = new createjs.Shape();
        const contextX = (x + 0.5) * SETTINGS.r;
        const contextY = SETTINGS.h - ((y + 0.5) * SETTINGS.r);

        point.graphics.beginStroke(SETTINGS.color).setStrokeStyle(SETTINGS.stroke - 1).drawRect(contextX, contextY, 2, -2);
        this.stage.addChild(point);
      }
    }
  };

  /**
   * Draw a circle at the location
   * @param {int} x
   * @param {int} y
   */
  drawCircle = (x, y) => {
    const circle = new createjs.Shape();

    circle.graphics.beginStroke(SETTINGS.color).setStrokeStyle(SETTINGS.stroke);
    const cornerX = ((x + 0.5) * SETTINGS.r) + 1;
    const cornerY = SETTINGS.h - ((y + 0.45) * SETTINGS.r) - 1;
    circle.graphics.drawCircle(cornerX, cornerY, SETTINGS.r * 0.40);

    this.stage.addChild(circle);
  };

  drawCube = (cube, camera, stage, x, y, isDashed = false) => {
    let drawLeft, drawTop, drawRight, drawBottom;
    const s = cube.surfaces;
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

    this._drawCubeSquare(stage, x, y, isDashed, drawLeft, drawTop, drawRight, drawBottom);
  };

  _drawCubeSquare = (stage, x, y, isDashed = false, drawLeft = true, drawTop = true, drawRight = true, drawBottom = true) => {
    const shape = new createjs.Shape();
    shape.graphics.beginStroke(SETTINGS.color).setStrokeStyle(SETTINGS.stroke);

    const sx = (x * SETTINGS.r) + 1;
    const dx = SETTINGS.r;
    const sy = SETTINGS.h - (y * SETTINGS.r) - 1;
    const dy = -SETTINGS.r;

    if (isDashed) {
      shape.graphics.setStrokeDash([4, 8], 0);
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

  drawRoof = (roof, camera, stage, x, y, isDashed = false) => {
    switch (camera) {
      case CamerasEnum.NORTH:
        if (roof.direction === 'n' || roof.direction === 's') {
          this._drawRoofSquare(stage, x, y, isDashed);
        } else if (roof.direction === 'w') {
          this._drawRoofSlantLeft(roof, stage, x, y, isDashed);
        } else if (roof.direction === 'e') {
          this._drawRoofSlantRight(roof, stage, x, y, isDashed);
        }
        break;
      case CamerasEnum.SOUTH:
        if (roof.direction === 'n' || roof.direction === 's') {
          this._drawRoofSquare(stage, x, y, isDashed);
        } else if (roof.direction === 'e') {
          this._drawRoofSlantLeft(roof, stage, x, y, isDashed);
        } else if (roof.direction === 'w') {
          this._drawRoofSlantRight(roof, stage, x, y, isDashed);
        }
        break;
      case CamerasEnum.EAST:
        if (roof.direction === 'e' || roof.direction === 'w') {
          this._drawRoofSquare(stage, x, y, isDashed);
        } else if (roof.direction === 's') {
          this._drawRoofSlantRight(roof, stage, x, y, isDashed);
        } else if (roof.direction === 'n') {
          this._drawRoofSlantLeft(roof, stage, x, y, isDashed);
        }
        break;
      case CamerasEnum.WEST:
        if (roof.direction === 'e' || roof.direction === 'w') {
          this._drawRoofSquare(stage, x, y, isDashed);
        } else if (roof.direction === 'n') {
          this._drawRoofSlantRight(roof, stage, x, y, isDashed);
        } else if (roof.direction === 's') {
          this._drawRoofSlantLeft(roof, stage, x, y, isDashed);
        }
        break;
      case CamerasEnum.TOP:
      case CamerasEnum.BOTTOM:
        this._drawRoofSquare(stage, x, y, isDashed);
        break;
      default:
    }
  };

  _drawRoofSquare = (stage, x, y, isDashed = false) => {
    const shape = new createjs.Shape();
    shape.graphics.beginStroke(SETTINGS.color).setStrokeStyle(SETTINGS.stroke);

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
  _drawRoofSlantLeft = (obj, stage, x, y, isDashed = false) => {
    const roof = new createjs.Shape();

    if (isDashed) {
      roof.graphics.setStrokeDash([4, 8], 0);
    }

    let cornerX = (x * SETTINGS.r) + 1;
    let cornerY = SETTINGS.h - (y * SETTINGS.r) - 1;
    roof.graphics.beginStroke(SETTINGS.color).setStrokeStyle(SETTINGS.stroke);
    roof.graphics.moveTo(cornerX, cornerY);
    cornerX += SETTINGS.r;
    cornerY -= SETTINGS.r;
    roof.graphics.lineTo(cornerX, cornerY);

    if (obj.hasSideSurface) {
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
  _drawRoofSlantRight = (obj, stage, x, y, isDashed = false) => {
    const roof = new createjs.Shape();

    if (isDashed) {
      roof.graphics.setStrokeDash([4, 8], 0);
    }

    let cornerX = (x * SETTINGS.r) + 1;
    let cornerY = SETTINGS.h - ((y + 1) * SETTINGS.r) - 1;
    roof.graphics.beginStroke(SETTINGS.color).setStrokeStyle(SETTINGS.stroke);
    roof.graphics.moveTo(cornerX, cornerY);
    cornerX += SETTINGS.r;
    cornerY += SETTINGS.r;
    roof.graphics.lineTo(cornerX, cornerY);

    if (obj.hasSideSurface) {
      cornerX -= SETTINGS.r;
      cornerY -= SETTINGS.r;
      roof.graphics.moveTo(cornerX, cornerY);
      cornerY += SETTINGS.r;
      roof.graphics.lineTo(cornerX, cornerY);
    }
    roof.graphics.endStroke();

    stage.addChild(roof);
  };

  /**
   * Draws the circle representing foliage of a tree at the given x and y.
   * @param {int} x
   * @param {int} y
   */
  drawFoliage = (camera, stage, x, y, isDashed = false) => {
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

  /**
   * Draws the trunk of a tree at the given x and y.
   * @param {int} x
   * @param {int} y
   * @param {boolean} isDashed - Whether the lines should be dashed or not
   */
  drawTrunk = (camera, stage, x, y, isDashed = false) => {
    const trunk = new createjs.Shape();

    if (isDashed) {
      trunk.graphics.setStrokeDash([4, 8], 0);
    }

    trunk.graphics.beginStroke(SETTINGS.color).setStrokeStyle(SETTINGS.stroke);
    const cornerX = ((x + 0.5) * SETTINGS.r) + 1;
    const cornerY = SETTINGS.h - (y * SETTINGS.r) - 1;

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
}
