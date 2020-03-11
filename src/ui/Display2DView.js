import { createjs } from '@createjs/easeljs';
import CamerasEnum from '../enums/CamerasEnum';
import { getEmpty2DArray } from '../helpers/Helpers';

import TopoRenderer2D from './TopoRenderer2D';
import DesignRenderer2D from './DesignRenderer2D';

/* global SETTINGS */

/** Class responsible for rednering a 2D slice */
export default class Display2DView {
  constructor(canvas, session) {
    this.session = session;
    this.stage = new createjs.Stage(canvas);
    this.designRenderer = new DesignRenderer2D(this.stage);
    this.topoRenderer = new TopoRenderer2D(this.stage);

    this.drawBackground = true; // Whether background slices should be rendered
  }

  /**
   * Draw the given sliceIndex for the camera angle to the screen
   * @param {int} camera - CamerasEnum
   * @param {int} sliceIndex - Index of slice of model from given camera view to draw
   * @param {int} isBackgroundDashed - Draw objects in background slices as dashed lines
   */
  draw = (camera, sliceIndex, isBackgroundDashed = true) => {
    // Clear the screen
    this.stage.removeAllChildren();

    // Draw the topography
    const topoSlice = this.session.topo.getSlice(camera, sliceIndex);
    if (topoSlice) {
      this.topoRenderer.draw(topoSlice);
    }

    // Draw the background slices
    if (this.drawBackground) {
      const topoBackgroundSlices = this.session.topo.getBackgroundSlices(camera, sliceIndex, SETTINGS.clippingMax);
      topoBackgroundSlices.forEach(s => this.topoRenderer.draw(s, isBackgroundDashed));

      const backgroundSlices = this.session.design.getBackgroundSlices(camera, sliceIndex, SETTINGS.clippingMax);
      backgroundSlices.forEach(s => this.designRenderer.drawSlice(camera, s, isBackgroundDashed));
    }

    // Draw the given slice
    const currentSlice = this.session.design.getSlice(camera, sliceIndex);
    this.designRenderer.drawSlice(camera, currentSlice);

    // Draw the grid of appropriate size for this slice
    this.designRenderer.drawGridPoints(currentSlice);

    // Render to the screen
    this.stage.update();
  };

  /**
   * Draw a version where all the layers are compressed into a single top view
   */
  drawTopCompressedView = () => {
    // Clear the screen
    this.stage.removeAllChildren();

    const allSlices = this.session.design.getBackgroundSlices(CamerasEnum.TOP, SETTINGS.zMax);
    // Reverse to go from bottom up
    allSlices.reverse();

    // Create master slice from all slices
    const masterSlice = getEmpty2DArray(SETTINGS.xMax, SETTINGS.yMax, null);
    for (let y = 0; y < SETTINGS.yMax; y += 1) {
      for (let x = 0; x < SETTINGS.xMax; x += 1) {
        let topObj = null;
        allSlices.forEach(slice => {
          const obj = slice[y][x];
          if (obj) {
            topObj = obj;
          }
        });
        masterSlice[y][x] = topObj;
      }
    }

    // draw dots at corners?
    this.drawGridPoints(masterSlice);

    this.designRenderer.drawSlice(CamerasEnum.TOP, masterSlice);

    // Render to the screen
    this.stage.update();
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
    line.graphics.beginStroke(SETTINGS.color).setStrokeStyle(SETTINGS.stroke);

    // Draw the heights left to right as a connected line
    topoSlice.forEach(s => {
      const { startHeight, endHeight } = s;
      cornerY = SETTINGS.h - 1 - (startHeight * SETTINGS.r);
      line.graphics.moveTo(cornerX, cornerY);
      cornerX += SETTINGS.r;
      cornerY = SETTINGS.h - 1 - (endHeight * SETTINGS.r);
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

        if (cell) {
          cell.draw2D(camera, this.stage, x, y, isDashed);
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

  animateX = (path, position, speed, callback) => {
    if (position >= path.length) {
      callback();
      return;
    }

    const p = path[position];
    const xObj = this.drawX(p.xNoise, p.yNoise);
    this.update();
    setTimeout(() => {
      this.stage.removeChild(xObj);
      this.animateX(path, position + 1, speed, callback);
    }, speed);
  };

  drawX = (x, y) => {
    const line = new createjs.Shape();
    line.graphics.beginStroke(SETTINGS.color).setStrokeStyle(SETTINGS.stroke);
    const offset = 0.2;
    const cornerX = (x + offset) * SETTINGS.r;
    const cornerY = SETTINGS.h - ((y + offset) * SETTINGS.r);
    line.graphics.moveTo(cornerX, cornerY).lineTo(cornerX + ((1 - (2 * offset)) * SETTINGS.r), cornerY - ((1 - (2 * offset)) * SETTINGS.r));

    const cornerX2 = (x + 1 - offset) * SETTINGS.r;
    const cornerY2 = SETTINGS.h - ((y + offset) * SETTINGS.r);
    line.graphics.moveTo(cornerX2, cornerY2).lineTo(cornerX2 - ((1 - (2 * offset)) * SETTINGS.r), cornerY2 - ((1 - (2 * offset)) * SETTINGS.r));
    return this.stage.addChild(line);
  }
}
