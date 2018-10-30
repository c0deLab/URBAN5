import { createjs } from '@createjs/easeljs';
import ObjectsEnum from './ObjectsEnum';
import ViewsEnum from './ViewsEnum';

/**
 * Responsible for rendering the design model to the scene and showing the appropriate camera view of it
 */
export default class DesignRenderer {
  constructor(designModel, stage) {
    this.designModel = designModel;
    this.stage = stage;
    this.r = 50;
    this.width = 852;
    this.height = 852;
    this.viewSize = 17;
    this.view = ViewsEnum.SOUTH;
    this.slice = 0;
    this.sliceMax = this.designModel.zMax;

    this.south();
  }

  /** Move the view to the next slice, without exceeding the last slice */
  nextSlice = () => this._setSlice(this.slice+1);
  /** Move the view to the previous slice, without going past 0 */
  previousSlice = () => this._setSlice(this.slice-1);

  /** Set the camera view to NORTH and reset the slice to 0 */
  north = () => this._setView('NORTH');
  /** Set the camera view to SOUTH and reset the slice to 0 */
  south = () => this._setView('SOUTH');
  /** Set the camera view to EAST and reset the slice to 0 */
  east = () => this._setView('EAST');
  /** Set the camera view to WEST and reset the slice to 0 */
  west = () => this._setView('WEST');
  /** Set the camera view to TOP and reset the slice to 0 */
  top = () => this._setView('TOP');
  /** Set the camera view to BOTTOM and reset the slice to 0 */
  bottom = () => this._setView('BOTTOM');

  rotateLeft = () => {
    switch (this.view) {
      case ViewsEnum.NORTH:
        this._setView('EAST');
        break;
      case ViewsEnum.EAST:
        this._setView('SOUTH');
        break;
      case ViewsEnum.SOUTH:
        this._setView('WEST');
        break;
      case ViewsEnum.WEST:
        this._setView('NORTH');
        break;
      default:
        // do nothing for top and bottom
    }
  };

  /**
   * Returns the model position of a click in the rendered view
   * @param {int} clickX - click x in canvas
   * @param {int} clickY - click y in canvas
   */
  getPosition = (clickX, clickY) => {
    let x;
    let y;
    let z;

    switch(this.view) {
      case ViewsEnum.SOUTH:
        x = Math.floor((clickX - 1)/this.r);
        y = this.viewSize-1-Math.floor((clickY - 1)/this.r);
        z = this.slice;
        break;
      case ViewsEnum.NORTH:
        x = this.designModel.xMax-1-Math.floor((clickX - 1)/this.r);
        y = this.viewSize-1-Math.floor((clickY - 1)/this.r);
        z = this.sliceMax-1-this.slice;
        break;
      case ViewsEnum.WEST:
        x = this.slice;
        y = this.viewSize-1-Math.floor((clickY - 1)/this.r);
        z = Math.floor((clickX - 1)/this.r);
        break;
      case ViewsEnum.EAST:
        x = this.sliceMax-1-this.slice;
        y = this.viewSize-1-Math.floor((clickY - 1)/this.r);
        z = this.designModel.xMax-1-Math.floor((clickX - 1)/this.r);
        break;
      case ViewsEnum.TOP:
        x = Math.floor((clickX - 1)/this.r);
        y = this.sliceMax-1-this.slice;
        z = this.viewSize-1-Math.floor((clickY - 1)/this.r);
        break;
      case ViewsEnum.BOTTOM:
        x = Math.floor((clickX - 1)/this.r);
        y = this.slice;
        z = Math.floor((clickY - 1)/this.r);
        break;
      default:
        throw new Error('view "' + this.view + '" is not recognized!');
    }

    switch(this.view) {
      case ViewsEnum.SOUTH:
      case ViewsEnum.NORTH:
      case ViewsEnum.WEST:
      case ViewsEnum.EAST:
        if (y >= this.designModel.yMax) {
          return null;
        }
        break;
      default:
        // do nothing
    }

    return {x:x, y:y, z:z};
  };

  /** Updates the easeljs stage with respect to the current model and view */
  updateStage = () => {
    this.stage.removeAllChildren();
    this._addObjectsToScene();
    this.stage.update();
  };

  /**
   * Set the slice in view, only runs if a legal slice
   * @param {int} slice - number of slice
   */
  _setSlice = (slice) => {
    if (slice >= 0 && slice <= this.sliceMax) {
      this.slice = slice;
      this.updateStage();
    }
    console.log('current slice: ' + this.slice);
  };

  /**
   * Set the camera view to the given view and reset the slice to 0
   * @param {String} view - ViewsEnum name
   */
  _setView = (view) => {
    console.log(view);
    this.view = ViewsEnum[view];
    this.slice = 0;

    switch(this.view) {
      case ViewsEnum.NORTH:
      case ViewsEnum.SOUTH:
        this.sliceMax = this.designModel.zMax;
        break;
      case ViewsEnum.WEST:
      case ViewsEnum.EAST:
        this.sliceMax = this.designModel.xMax;
        break;
      case ViewsEnum.TOP:
      case ViewsEnum.BOTTOM:
        this.sliceMax = this.designModel.yMax;
        break;
      default:
        throw new Error('view "' + this.view + '" is not recognized!');
    }
    this.updateStage();
  };

  /** Add the background and current slice objects to the scene based on the current view and slice */
  _addObjectsToScene = () => {
    const backgroundSlice = this.designModel.getBackgroundSlice(this.view, this.slice);
    //console.table(backgroundSlice);
    this._addSlice(backgroundSlice, true);

    const currentSlice = this.designModel.getSlice(this.view, this.slice);
    //console.table(currentSlice);
    this._addSlice(currentSlice);
  };

  /**
   * Add a slice to the view
   * @param {int[][]} slice - 2D array representing slice to add
   * @param {boolean} isDashed - whether the lines should be dashed or not
   */
  _addSlice = (slice, isDashed = false) => {
    for (let x = 0; x < slice.length; x++) {
      const col = slice[x];
      for (let y = 0; y < col.length; y++) {
        const cell = col[y];

        const left = (x-1) >= 0 ? slice[x-1][y] : null;
        const top = (y+1) < col.length ? col[y+1] : null;
        const right = (x+1) < slice.length ? slice[x+1][y] : null;
        const bottom = (y-1) >= 0 ? col[y-1] : null;
        const context = [left, top, right, bottom];

        // draw object
        switch(cell) {
          case ObjectsEnum.CUBE:
            this._addCube(x, y, isDashed, context);
            break;
          case ObjectsEnum.TRUNK:
            this._addTrunk(x, y);
            break;
          case ObjectsEnum.FOLIAGE:
            this._addFoliage(x, y);
            break;
          default:
            // Draw nothing
            break;
        }

        // draw center point
        const point = new createjs.Shape();
        point.graphics.beginStroke('#ffffff').setStrokeStyle(2).drawRect(((x+0.5)*this.r), this.height-((y+0.5)*this.r), 2, -2);
        this.stage.addChild(point);
      }
    }
  };

  /**
   * Add a cube at the given x and y. Dashed version is for background slices
   * @param {int} x - x location to cube
   * @param {int} y - y location to cube
   * @param {boolean} isDashed - Whether the lines should be dashed or not
   * @param {int[]} context - The surrounding area [top, left, bottom, right]
   */
  _addCube = (x, y, isDashed = false, context) => {
    const shape = new createjs.Shape();

    if (isDashed) {
      shape.graphics.setStrokeDash([3, 7], 0);
    }

    //shape.graphics.beginStroke('#ffffff').setStrokeStyle(3).drawRect((x*this.r)+1, this.height-(y*this.r)-1, this.r, -this.r);

    // switch to all lines,  check top, right, bottom, left and don't render if other object there
    const sx = (x*this.r)+1;
    const dx = this.r;
    const sy = this.height-(y*this.r)-1;
    const dy = -this.r;
    //console.log(context);
    if (context[0] !== 0) { // left
      shape.graphics.beginStroke('#ffffff').setStrokeStyle(3).moveTo(sx, sy).lineTo(sx, sy+dy);
    }
    if (context[1] !== 0) { // top
      shape.graphics.beginStroke('#ffffff').setStrokeStyle(3).moveTo(sx, sy+dy).lineTo(sx+dx, sy+dy);
    }
    if (context[2] !== 0) { // right
      shape.graphics.beginStroke('#ffffff').setStrokeStyle(3).moveTo(sx+dx, sy+dy).lineTo(sx+dx, sy);
    }
    if (context[3] !== 0) { // bottom
      shape.graphics.beginStroke('#ffffff').setStrokeStyle(3).moveTo(sx+dx, sy).lineTo(sx, sy);
    }

    this.stage.addChild(shape);
  };

  _addTrunk = (x, y) => {
    const trunk = new createjs.Shape();
    trunk.graphics.beginStroke('#ffffff').setStrokeStyle(3).drawRect(((x+0.5)*this.r)+1, this.height-(y*this.r)-1, 2, -this.r);

    this.stage.addChild(trunk);
  };

  _addFoliage = (x, y) => {
    const foliage = new createjs.Shape();
    foliage.graphics.beginStroke('#ffffff').setStrokeStyle(3).drawCircle(((x+0.5)*this.r)+1, this.height-((y+0.45)*this.r)-1, this.r*0.40);

    this.stage.addChild(foliage);
  };

}
