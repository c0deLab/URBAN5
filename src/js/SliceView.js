import { createjs } from '@createjs/easeljs';
import ObjectsEnum from './enums/ObjectsEnum';
import CamerasEnum from './enums/CamerasEnum';
import { getCellContext3x3 } from './ArrayHelpers';

/**
 * Responsible for drawing a 2D slice
 */
export default class SliceView {
  constructor(canvas, model) {
    this.stage = new createjs.Stage(canvas);
    this.gridSize = 17;
    this.height = canvas.height;
    this.r = (this.height - 2) / this.gridSize;
    this.model = model;
    this.color = '#ffffff';
    this.drawBackground = true;
  }

  draw = (camera, sliceIndex) => {
    this.stage.removeAllChildren();
    const topoSlice = this.model.getTopoSlice(camera, sliceIndex);
    if (topoSlice) {
      this._drawTopoSlice(topoSlice);
    }

    if (this.drawBackground) {
      const backgroundSlices = this.model.getBackgroundSlices(camera, sliceIndex);
      for (const slice of backgroundSlices) {
        this._drawSlice(camera, slice, true);
      //console.table(currentSlice);
      }
    }

    const currentSlice = this.model.getSlice(camera, sliceIndex);
    this._drawSlice(camera, currentSlice);

    this._drawGridPoints(currentSlice);
    this.stage.update();
  };

  clear = () => {
    this.stage.removeAllChildren();
    this.stage.update();
  };

  _drawTopoSlice = topoSlice => {
    const line = new createjs.Shape();
    let cornerX = 1;
    let cornerY;
    line.graphics.beginStroke(this.color).setStrokeStyle(3);

    for (let i = 0; i < topoSlice.length; i += 1) {
      const { startHeight, endHeight } = topoSlice[i];
      cornerY = this.height - 1 - (startHeight * this.r);
      line.graphics.moveTo(cornerX, cornerY);
      cornerX += this.r;
      cornerY = this.height - 1 - (endHeight * this.r);
      line.graphics.lineTo(cornerX, cornerY);
    }

    line.graphics.endStroke();

    this.stage.addChild(line);
  };

  /**
   * Add a slice to the view
   * @param {int[][]} slice - 2D array representing slice to add
   * @param {boolean} isDashed - whether the lines should be dashed or not
   */
  _drawSlice = (camera, slice, isDashed = false) => {
    this.camera = camera;
    for (let y = 0; y < slice.length; y += 1) {
      const row = slice[y];
      for (let x = 0; x < row.length; x += 1) {
        const cell = row[x];

        const context = getCellContext3x3(slice, x, y);

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
          default:
            // Draw nothing
            break;
        }
      }
    }
  };

  /**
   * Add a slice to the view
   * @param {int[][]} slice - 2D array representing slice to add
   * @param {boolean} isDashed - whether the lines should be dashed or not
   */
  _drawGridPoints = slice => {
    for (let y = 0; y < slice.length; y += 1) {
      const row = slice[y];
      for (let x = 0; x < row.length; x += 1) {
        const point = new createjs.Shape();
        const contextX = (x + 0.5) * this.r;
        const contextY = this.height - ((y + 0.5) * this.r);

        point.graphics.beginStroke(this.color).setStrokeStyle(2).drawRect(contextX, contextY, 2, -2);
        this.stage.addChild(point);
      }
    }
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

    const {
      top, left, right, bottom
    } = context;
    const drawTop = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFLEFT, ObjectsEnum.ROOFRGHT].includes(top);
    const drawBottom = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFLEFT, ObjectsEnum.ROOFRGHT].includes(bottom);

    switch (this.camera) {
      case CamerasEnum.NORTH:
      case CamerasEnum.SOUTH:
        drawLeft = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFLEFT].includes(left);
        drawRight = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFRGHT1].includes(right);
        break;
      default:
        drawLeft = ![ObjectsEnum.CUBE].includes(left);
        drawRight = ![ObjectsEnum.CUBE].includes(right);
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
    trunk.graphics.beginStroke(this.color).setStrokeStyle(3);
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
    foliage.graphics.beginStroke(this.color).setStrokeStyle(3);
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
  _drawRoofLeft = (x, y, isDashed, context) => {
    let withLine;
    const { left, right } = context;
    switch (this.camera) {
      case CamerasEnum.NORTH:
        withLine = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFRGHT].includes(right);
        this._drawLineSlantLeft(x, y, isDashed, withLine);
        break;
      case CamerasEnum.SOUTH:
        withLine = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFRGHT].includes(left);
        this._drawLineSlantRight(x, y, isDashed, withLine);
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
  _drawRoofRight = (x, y, isDashed, context) => {
    let withLine;
    const { left, right } = context;
    switch (this.camera) {
      case CamerasEnum.NORTH:
        withLine = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFLEFT].includes(left);
        this._drawLineSlantRight(x, y, isDashed, withLine);
        break;
      case CamerasEnum.SOUTH:
        withLine = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFLEFT].includes(right);
        this._drawLineSlantLeft(x, y, isDashed, withLine);
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
    shape.graphics.beginStroke(this.color).setStrokeStyle(3);

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
  _drawLineSlantLeft = (x, y, isDashed = false, withLine = false) => {
    const roof = new createjs.Shape();

    if (isDashed) {
      roof.graphics.setStrokeDash([3, 8.5], 0);
    }

    let cornerX = (x * this.r) + 1;
    let cornerY = this.height - (y * this.r) - 1;
    roof.graphics.beginStroke(this.color).setStrokeStyle(3);
    roof.graphics.moveTo(cornerX, cornerY);
    cornerX += this.r;
    cornerY -= this.r;
    roof.graphics.lineTo(cornerX, cornerY);

    if (withLine) {
      roof.graphics.moveTo(cornerX, cornerY);
      cornerY += this.r;
      roof.graphics.lineTo(cornerX, cornerY);
    }
    roof.graphics.endStroke();

    this.stage.addChild(roof);
  };

  /**
   * Draw a line that slants down to the right
   * @param {int} x
   * @param {int} y
   */
  _drawLineSlantRight = (x, y, isDashed = false, withLine = false) => {
    const roof = new createjs.Shape();

    if (isDashed) {
      roof.graphics.setStrokeDash([3, 8.5], 0);
    }

    let cornerX = (x * this.r) + 1;
    let cornerY = this.height - ((y + 1) * this.r) - 1;
    roof.graphics.beginStroke(this.color).setStrokeStyle(3);
    roof.graphics.moveTo(cornerX, cornerY);
    cornerX += this.r;
    cornerY += this.r;
    roof.graphics.lineTo(cornerX, cornerY);

    if (withLine) {
      cornerX -= this.r;
      cornerY -= this.r;
      roof.graphics.moveTo(cornerX, cornerY);
      cornerY += this.r;
      roof.graphics.lineTo(cornerX, cornerY);
    }
    roof.graphics.endStroke();

    this.stage.addChild(roof);
  };
}
