import { createjs } from '@createjs/easeljs';
import ObjectsEnum from './enums/ObjectsEnum';
import CamerasEnum from './enums/CamerasEnum';
import { getCellContext3x3, getEmpty2DArray } from './ArrayHelpers';

/** Class responsible for rednering a 2D slice */
export default class Display2DView {
  constructor(canvas, model) {
    this.model = model;
    this.stage = new createjs.Stage(canvas);

    this.gridSize = 17;
    this.height = canvas.height;
    this.r = (this.height - 2) / this.gridSize;
    this.color = '#E8E8DA';
    this.drawBackground = true; // Whether background slices should be rendered
  }

  /**
   * Draw the given sliceIndex for the camera angle to the screen
   * @param {int} camera - CamerasEnum
   * @param {int} sliceIndex - Index of slice of model from given camera view to draw
   * @param {int} isBackgroundDashed - Draw objects in background slices as dashed lines
   */
  draw = (camera, sliceIndex, isBackgroundDashed=true) => {
    // Clear the screen
    this.stage.removeAllChildren();

    // Draw the topography
    const topoSlice = this.model.getTopoSlice(camera, sliceIndex);
    if (topoSlice) {
      this._drawTopoSlice(topoSlice);
    }

    // Draw the background slices
    if (this.drawBackground) {
      const backgroundSlices = this.model.getBackgroundSlices(camera, sliceIndex);
      backgroundSlices.forEach(s => this._drawSlice(camera, s, isBackgroundDashed));
    }

    // Draw the given slice
    const currentSlice = this.model.getSlice(camera, sliceIndex);
    this._drawSlice(camera, currentSlice);

    // Draw the grid of appropriate size for this slice
    this._drawGridPoints(currentSlice);

    // Render to the screen
    this.stage.update();
  };

  /**
   * Draw a version where all the layers are compressed into a single top view
   */
  drawTopCompressedView = () => {
    // Clear the screen
    this.stage.removeAllChildren();

    const allSlices = this.model.getBackgroundSlices(CamerasEnum.TOP, this.model.zMax);
    // Reverse to go from bottom up
    allSlices.reverse();

    // Create master slice from all slices
    const masterSlice = getEmpty2DArray(this.model.xMax, this.model.yMax, null);
    for (let y = 0; y < this.model.yMax; y += 1) {
      for (let x = 0; x < this.model.xMax; x += 1) {
        let topObj = null;
        allSlices.forEach(slice => {
          const obj = slice[y][x];
          if ([ObjectsEnum.CUBE, ObjectsEnum.ROOFLEFT, ObjectsEnum.ROOFRGHT].includes(obj)) {
            topObj = ObjectsEnum.CUBE; // Simplify view to be all cubes that merge
          } else if ([ObjectsEnum.FOLIAGE, ObjectsEnum.TREE].includes(obj)) {
            topObj = ObjectsEnum.FOLIAGE; // Simplify trees
          }
        });
        masterSlice[y][x] = topObj;
      }
    }

    this._drawSlice(CamerasEnum.TOP, masterSlice);

    // Render to the screen
    this.stage.update();
  };

  /** Update the screen */
  update = () => {
    this.stage.update();
  };

  /** Clear the screen */
  clear = () => {
    this.stage.removeAllChildren();
    this.stage.update();
  };

  /**
   * Draw a line representing the 1D slice of topography
   * @param {array} topoSlice - heights at given locations
   */
  _drawTopoSlice = topoSlice => {
    const line = new createjs.Shape();
    let cornerX = 1;
    let cornerY;
    line.graphics.beginStroke(this.color).setStrokeStyle(3);

    // Draw the heights left to right as a connected line
    topoSlice.forEach(s => {
      const { startHeight, endHeight } = s;
      cornerY = this.height - 1 - (startHeight * this.r);
      line.graphics.moveTo(cornerX, cornerY);
      cornerX += this.r;
      cornerY = this.height - 1 - (endHeight * this.r);
      line.graphics.lineTo(cornerX, cornerY);
    });
    line.graphics.endStroke();

    this.stage.addChild(line);
  };

  /**
   * Add a slice to the view
   * @param {int} camera - CamerasEnum
   * @param {int[][]} slice - 2D array representing slice to add
   * @param {boolean} isDashed - Whether the lines should be dashed or not
   */
  _drawSlice = (camera, slice, isDashed = false) => {
    this.camera = camera;
    for (let y = 0; y < slice.length; y += 1) {
      const row = slice[y];
      for (let x = 0; x < row.length; x += 1) {
        const cell = row[x];

        // Get the context around the cell to determine which lines to join
        const context = getCellContext3x3(slice, x, y);

        switch (cell) {
          case ObjectsEnum.CUBE:
            this._drawCube(x, y, isDashed, context);
            break;
          case ObjectsEnum.TREE:
            this._drawTrunk(x, y, isDashed);
            break;
          case ObjectsEnum.FOLIAGE:
            this._drawFoliage(x, y, isDashed);
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
   * Draw points that match the size of the current slice
   * @param {int[][]} slice - 2D array representing slice to add
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
    let drawTop;
    let drawBottom;

    const {
      top, left, right, bottom
    } = context;
    // Determine which lines to remove representing joins
    drawTop = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFLEFT, ObjectsEnum.ROOFRGHT].includes(top);
    drawBottom = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFLEFT, ObjectsEnum.ROOFRGHT].includes(bottom);

    // Lines on the sides require knowing the camera angle
    switch (this.camera) {
      case CamerasEnum.NORTH:
      case CamerasEnum.SOUTH:
        drawLeft = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFLEFT].includes(left);
        drawRight = ![ObjectsEnum.CUBE, ObjectsEnum.ROOFRGHT].includes(right);
        break;
      default:
        drawLeft = ![ObjectsEnum.CUBE].includes(left);
        drawRight = ![ObjectsEnum.CUBE].includes(right);
        break;
    }

    this._drawSquare(x, y, isDashed, drawLeft, drawTop, drawRight, drawBottom);
  };

  /**
   * Draws the trunk of a tree at the given x and y.
   * @param {int} x
   * @param {int} y
   * @param {boolean} isDashed - Whether the lines should be dashed or not
   */
  _drawTrunk = (x, y, isDashed = false) => {
    const trunk = new createjs.Shape();

    if (isDashed) {
      trunk.graphics.setStrokeDash([3, 7], 0);
    }

    trunk.graphics.beginStroke(this.color).setStrokeStyle(3);
    let cornerX = ((x + 0.5) * this.r) + 1;
    let cornerY = this.height - (y * this.r) - 1;

    // The trunk is a rectangle from the side and a dot from the ends
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
  _drawFoliage = (x, y, isDashed = false) => {
    const foliage = new createjs.Shape();

    if (isDashed) {
      foliage.graphics.setStrokeDash([3, 7], 0);
    }

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

  /**
   * Draw a circle at the location
   * @param {int} x
   * @param {int} y
   */
  drawCircle = (x, y) => {
    const circle = new createjs.Shape();

    circle.graphics.beginStroke(this.color).setStrokeStyle(3);
    const cornerX = ((x + 0.5) * this.r) + 1;
    const cornerY = this.height - ((y + 0.45) * this.r) - 1;
    circle.graphics.drawCircle(cornerX, cornerY, this.r * 0.40);

    this.stage.addChild(circle);
  };
}
