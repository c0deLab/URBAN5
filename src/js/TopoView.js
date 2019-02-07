import { createjs } from '@createjs/easeljs';

/** Class responsible for rednering a 2D slice */
export default class TopoView {
  constructor(canvas, model) {
    this.model = model;
    this.stage = new createjs.Stage(canvas);

    this.gridSize = 17;
    this.height = canvas.height;
    this.r = (this.height - 2) / this.gridSize;
    this.color = '#E8E8DA';
  }

  /**
   * Draw the given sliceIndex for the camera angle to the screen
   * @param {int} camera - CamerasEnum
   * @param {int} sliceIndex - Index of slice of model from given camera view to draw
   * @param {int} isBackgroundDashed - Draw objects in background slices as dashed lines
   */
  draw = () => {
    // Clear the screen
    this.stage.removeAllChildren();

    for (let y = 0; y < this.model.yMax; y += 1) {
      for (let x = 0; x < this.model.xMax; x += 1) {
        this._drawSquare(x, y, this.model.getTopoHeight({ x, y }));
      }
    }

    // Render to the screen
    this.stage.update();
  };

  /**
   * Add a square at x,y with number representing height
   * @param {int} x
   * @param {int} y
   */
  _drawSquare = (x, y, num) => {
    const shape = new createjs.Shape();
    shape.graphics.beginStroke(this.color).setStrokeStyle(1);

    const sx = (x * this.r) + 1;
    const dx = this.r;
    const sy = this.height - (y * this.r) - 1;
    const dy = -this.r;

    shape.graphics.drawRect(sx, sy, dx, dy);
    this.stage.addChild(shape);

    const text = new createjs.Text(num, "bold 17px Andale Mono", this.color);
    text.x = sx + (dx / 2) - 5;
    text.y = sy + (dy / 2) - 6;
    this.stage.addChild(text);
  };
}
