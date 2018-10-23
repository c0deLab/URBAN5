/*
*
* DesignRenderer.js
*
* Responsible for rendering the design model to the scene and showing the appropriate camera view of it
*
* 2D rendering: 
*
*/

import { createjs } from '@createjs/easeljs';
import ObjectsEnum from './ObjectsEnum';
import ViewsEnum from './ViewsEnum';

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

  // Get the model position of a click in the rendered view
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

    return {x:x, y:y, z:z};
  };

  updateStage = () => {
    this.stage.removeAllChildren();
    this.addObjectsToScene();
    this.stage.update();
  };

  nextSlice = () => {
    if (this.slice < this.sliceMax) {
      this.slice++;
    }
    console.log('next slice: ' + this.slice);
    this.updateStage();
  };

  previousSlice = () => {
    if (this.slice > 0) {
      this.slice--;
    }
    console.log('previous slice: ' + this.slice);
    this.updateStage();
  };

  north = () => {
    console.log('north');
    this.view = ViewsEnum.NORTH;
    this.slice = 0;
    this.sliceMax = this.designModel.zMax;
    this.updateStage();
  };

  east = () => {
    console.log('east');
    this.view = ViewsEnum.EAST;
    this.slice = 0;
    this.sliceMax = this.designModel.xMax;
    this.updateStage();
  };

  south = () => {
    console.log('south');
    this.view = ViewsEnum.SOUTH;
    this.slice = 0;
    this.sliceMax = this.designModel.zMax;
    this.updateStage();
  };

  west = () => {
    console.log('west');
    this.view = ViewsEnum.WEST;
    this.slice = 0;
    this.sliceMax = this.designModel.xMax;
    this.updateStage();
  };

  top = () => {
    console.log('top');
    this.view = ViewsEnum.TOP;
    this.slice = 0;
    this.sliceMax = this.designModel.yMax;
    this.updateStage();
  };

  bottom = () => {
    console.log('bottom');
    this.view = ViewsEnum.BOTTOM;
    this.slice = 0;
    this.sliceMax = this.designModel.yMax;
    this.updateStage();
  };

  addObjectsToScene = () => {
    const backgroundSlice = this.designModel.getBackgroundSlice(this.view, this.slice);
    //console.table(backgroundSlice);
    this.addSlice(backgroundSlice, true);

    const currentSlice = this.designModel.getSlice(this.view, this.slice);
    //console.table(currentSlice);
    this.addSlice(currentSlice);
  };

  addSlice = (slice, isDashed = false) => {
    for (let x = 0; x < slice.length; x++) {
      const row = slice[x];
      for (let y = 0; y < row.length; y++) {
        const cell = row[y];

        // draw object
        switch(cell) {
          case ObjectsEnum.CUBE:
            this.addCube(x, y, isDashed);
            break;
          case ObjectsEnum.TRUNK:
            this.addTrunk(x, y);
            break;
          case ObjectsEnum.FOLIAGE:
            this.addFoliage(x, y);
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

  addCube = (x, y, isDashed = false) => {
    const shape = new createjs.Shape();

    if (isDashed) {
      shape.graphics.setStrokeDash([3, 7], 0);
    }

    shape.graphics.beginStroke('#ffffff').setStrokeStyle(3).drawRect((x*this.r)+1, this.height-(y*this.r)-1, this.r, -this.r);
    this.stage.addChild(shape);
  };

  addTrunk = (x, y) => {
    const trunk = new createjs.Shape();
    trunk.graphics.beginStroke('#ffffff').setStrokeStyle(3).drawRect(((x+0.5)*this.r)+1, this.height-(y*this.r)-1, 2, -this.r);
    
    this.stage.addChild(trunk);
  };

  addFoliage = (x, y) => {
    const foliage = new createjs.Shape();
    foliage.graphics.beginStroke('#ffffff').setStrokeStyle(3).drawCircle(((x+0.5)*this.r)+1, this.height-((y+0.45)*this.r)-1, this.r*0.40);
    
    this.stage.addChild(foliage);
  };
  
}