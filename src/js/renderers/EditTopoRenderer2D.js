import { createjs } from '@createjs/easeljs';

/* global SETTINGS */

/** Class responsible for rednering a 2D slice */
export default class EditTopoRenderer2D {
  constructor(stage) {
    this.stage = stage;
  }

  /**
   * Add a square at x,y with number representing height
   */
  drawSquare = (x, y, num) => {
    const shape = new createjs.Shape();
    shape.graphics.beginStroke(SETTINGS.color).setStrokeStyle(1);

    const sx = (x * SETTINGS.r) + 1;
    const dx = SETTINGS.r;
    const sy = SETTINGS.h - (y * SETTINGS.r) - 1;
    const dy = -SETTINGS.r;

    shape.graphics.drawRect(sx, sy, dx, dy);
    this.stage.addChild(shape);

    const text = new createjs.Text(num, 'bold 17px Andale Mono', SETTINGS.color);
    text.x = sx + (dx / 2) - 5;
    text.y = sy + (dy / 2) - 6;
    this.stage.addChild(text);
  }
}
