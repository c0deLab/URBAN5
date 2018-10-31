import { createjs } from '@createjs/easeljs';
import ObjectsEnum from './enums/ObjectsEnum';
import CamerasEnum from './enums/CamerasEnum';

/**
 * Responsible for drawing a 2D slice
 */
export default class SliceView {
  constructor(stage, resolution) {
    this.stage = stage;
    this.r = resolution;
    this.gridSize = 17;
    this.height = 852;
  }

  /** Add the background and current slice objects to the scene based on the current camera angle and slice */
  drawCurrentView = (camera, topoSlice, currentSlice, backgroundSlice) => {
    this.stage.removeAllChildren();
    this._drawSlice(camera, topoSlice);
    this._drawSlice(camera, backgroundSlice, true);
    this._drawSlice(camera, currentSlice);
    this.stage.update();
  };

  /**
   * Add a slice to the view
   * @param {int[][]} slice - 2D array representing slice to add
   * @param {boolean} isDashed - whether the lines should be dashed or not
   */
  _drawSlice = (camera, slice, isDashed = false) => {
    this.camera = camera;
    for (let x = 0; x < slice.length; x += 1) {
      const col = slice[x];
      for (let y = 0; y < col.length; y += 1) {
        const cell = col[y];

        const left = (x - 1) >= 0 ? slice[x - 1][y] : null;
        const top = (y + 1) < col.length ? col[y + 1] : null;
        const right = (x + 1) < slice.length ? slice[x + 1][y] : null;
        const bottom = (y - 1) >= 0 ? col[y - 1] : null;
        const context = [left, top, right, bottom];

        // bug with how roofs are drawn... they should connect down

        // draw object
        switch (cell) {
          case ObjectsEnum.CUBE:
            this._drawCube(x, y, isDashed, context);
            break;
          case ObjectsEnum.TREE:
            this._drawTrunk(x, y);
            break;
          case ObjectsEnum.FOLIAGE:
            this._drawFoliage(x, y);
            break;
          case ObjectsEnum.ROOFLEFT:
            this._drawRoofLeft(x, y, isDashed, context);
            break;
          case ObjectsEnum.ROOFRGHT:
            this._drawRoofRight(x, y, isDashed, context);
            break;
          case ObjectsEnum.GROUND:
            if (camera !== CamerasEnum.TOP && camera !== CamerasEnum.BOTTOM) {
              this._drawGround(x, y, isDashed, context);
            }
            break;
          default:
            // Draw nothing
            break;
        }

        this._drawGridPoint(x, y);
      }
    }
  };

  /**
   * Draw a point at x, y.
   * @param {int} x
   * @param {int} y
   */
  _drawGridPoint = (x, y) => {
    const point = new createjs.Shape();
    const contextX = (x + 0.5) * this.r;
    const contextY = this.height - ((y + 0.5) * this.r);

    point.graphics.beginStroke('#ffffff').setStrokeStyle(2).drawRect(contextX, contextY, 2, -2);
    this.stage.addChild(point);
  };

  /**
   * Add a square representing a cube at the given x and y. Dashed version is for background slices.
   * Remove lines that link this to adjacent cubes or roofs.
   * @param {int} x
   * @param {int} y
   * @param {boolean} isDashed - Whether the lines should be dashed or not
   * @param {int[]} context - The surrounding area [top, left, bottom, right]
   */
  _drawCube = (x, y, isDashed = false, context) => {
    let drawLeft;
    let drawRight;
    const drawTop = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFLEFT, ObjectsEnum.ROOFRGHT].includes(context[1]);
    const drawBottom = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFLEFT, ObjectsEnum.ROOFRGHT].includes(context[3]);

    switch (this.camera) {
      case CamerasEnum.NORTH:
        drawLeft = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFRGHT].includes(context[0]);
        drawRight = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFLEFT].includes(context[2]);
        break;
      case CamerasEnum.SOUTH:
        drawLeft = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFLEFT].includes(context[0]);
        drawRight = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFRGHT].includes(context[2]);
        break;
      default:
        drawLeft = ![ObjectsEnum.CUBE].includes(context[0]);
        drawRight = ![ObjectsEnum.CUBE].includes(context[2]);
        break;
    }

    this._drawSquare(x, y, isDashed, drawLeft, drawTop, drawRight, drawBottom);
  };

  /**
   * Draws the trunk of a tree at the given x and y. It is a rectangle from the side and a dot from the ends
   * @param {int} x
   * @param {int} y
   */
  _drawTrunk = (x, y) => {
    const trunk = new createjs.Shape();
    trunk.graphics.beginStroke('#ffffff').setStrokeStyle(3);
    let cornerX = ((x + 0.5) * this.r) + 1;
    let cornerY = this.height - (y * this.r) - 1;

    switch (this.camera) {
      case CamerasEnum.NORTH:
      case CamerasEnum.SOUTH:
      case CamerasEnum.WEST:
      case CamerasEnum.EAST:
        // Draw a rectangle
        trunk.graphics.drawRect(cornerX, cornerY, 2, -this.r);
        break;
      case CamerasEnum.TOP:
      case CamerasEnum.BOTTOM:
        // Draw a point
        cornerX -= 2;
        cornerY -= (0.5 * this.r) + 2;
        trunk.graphics.drawRect(cornerX, cornerY, 6, 6);
        break;
      default:
        throw new Error(`camera ${this.camera} is not recognized!`);
    }

    this.stage.addChild(trunk);
  };

  /**
   * Draws the circle representing foliage of a tree at the given x and y.
   * @param {int} x
   * @param {int} y
   */
  _drawFoliage = (x, y) => {
    const foliage = new createjs.Shape();
    foliage.graphics.beginStroke('#ffffff').setStrokeStyle(3);
    const cornerX = ((x + 0.5) * this.r) + 1;
    const cornerY = this.height - ((y + 0.45) * this.r) - 1;
    foliage.graphics.drawCircle(cornerX, cornerY, this.r * 0.40);

    this.stage.addChild(foliage);
  };

  /**
   * Add a roof at the given x and y. It is slanted upwards to the East
   * @param {int} x
   * @param {int} y
   */
  _drawRoofLeft = (x, y, isDashed) => {
    switch (this.camera) {
      case CamerasEnum.SOUTH:
        this._drawLineSlantLeft(x, y, isDashed);
        break;
      case CamerasEnum.NORTH:
        this._drawLineSlantRight(x, y, isDashed);
        break;
      case CamerasEnum.WEST:
      case CamerasEnum.EAST:
      case CamerasEnum.TOP:
      case CamerasEnum.BOTTOM:
        this._drawSquare(x, y, isDashed);
        break;
      default:
        throw new Error(`camera ${this.camera} is not recognized!`);
    }
  };

  /**
   * Add a roof at the given x and y. It is slanted upwards to the West
   * @param {int} x
   * @param {int} y
   */
  _drawRoofRight = (x, y, isDashed) => {
    switch (this.camera) {
      case CamerasEnum.SOUTH:
        this._drawLineSlantRight(x, y, isDashed);
        break;
      case CamerasEnum.NORTH:
        this._drawLineSlantLeft(x, y, isDashed);
        break;
      case CamerasEnum.WEST:
      case CamerasEnum.EAST:
      case CamerasEnum.TOP:
      case CamerasEnum.BOTTOM:
        this._drawSquare(x, y, isDashed);
        break;
      default:
        throw new Error(`camera ${this.camera} is not recognized!`);
    }
  };

  /**
   * Add a square at x,y. Optional parameters for dashed or not rendering certain sides
   * @param {int} x
   * @param {int} y
   * @param {boolean} [isDashed]
   * @param {boolean} [drawLeft]
   * @param {boolean} [drawTop]
   * @param {boolean} [drawRight]
   * @param {boolean} [drawBottom]
   */
  _drawSquare = (x, y, isDashed = false, drawLeft = true, drawTop = true, drawRight = true, drawBottom = true) => {
    const shape = new createjs.Shape();
    shape.graphics.beginStroke('#ffffff').setStrokeStyle(3);

    const sx = (x * this.r) + 1;
    const dx = this.r;
    const sy = this.height - (y * this.r) - 1;
    const dy = -this.r;

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

    this.stage.addChild(shape);
  };

  /**
   * Draw a line that slants down to the left
   * @param {int} x
   * @param {int} y
   */
  _drawLineSlantLeft = (x, y, isDashed) => {
    const roof = new createjs.Shape();

    if (isDashed) {
      roof.graphics.setStrokeDash([3, 8.5], 0);
    }

    let cornerX = (x * this.r) + 1;
    let cornerY = this.height - (y * this.r) - 1;
    roof.graphics.beginStroke('#ffffff').setStrokeStyle(3);
    roof.graphics.moveTo(cornerX, cornerY);
    cornerX += this.r;
    cornerY -= this.r;
    roof.graphics.lineTo(cornerX, cornerY);
    roof.graphics.endStroke();

    this.stage.addChild(roof);
  };

  /**
   * Draw a line that slants down to the right
   * @param {int} x
   * @param {int} y
   */
  _drawLineSlantRight = (x, y, isDashed) => {
    const roof = new createjs.Shape();

    if (isDashed) {
      roof.graphics.setStrokeDash([3, 8.5], 0);
    }

    let cornerX = (x * this.r) + 1;
    let cornerY = this.height - ((y + 1) * this.r) - 1;
    roof.graphics.beginStroke('#ffffff').setStrokeStyle(3);
    roof.graphics.moveTo(cornerX, cornerY);
    cornerX += this.r;
    cornerY += this.r;
    roof.graphics.lineTo(cornerX, cornerY);
    roof.graphics.endStroke();

    this.stage.addChild(roof);
  };

  /**
   * Draw a line at the top of the square
   * @param {int} x
   * @param {int} y
   */
  _drawGround = (x, y, isDashed) => {
    const ground = new createjs.Shape();

    if (isDashed) {
      ground.graphics.setStrokeDash([3, 8.5], 0);
    }

    let cornerX = (x * this.r) + 1;
    let cornerY = this.height - (y * this.r) - 1;
    ground.graphics.beginStroke('#ffffff').setStrokeStyle(3);
    ground.graphics.moveTo(cornerX, cornerY);
    cornerX += this.r;
    ground.graphics.lineTo(cornerX, cornerY);
    ground.graphics.endStroke();

    this.stage.addChild(ground);
  };
}
