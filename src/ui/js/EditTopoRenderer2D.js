import { createjs } from '@createjs/easeljs';

/* global SETTINGS */

const grayValues = [0, 60, 110, 150, 180, 205, 225, 240];

/** Class responsible for rendering a 2D slice */
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

    const grayValue = grayValues[num];
    const fill = `rgba(${grayValue}, ${grayValue}, ${grayValue}, 0.7)`;
    shape.graphics.beginFill(fill);
    shape.graphics.drawRect(sx, sy, dx, dy);
    shape.graphics.endFill();
    this.stage.addChild(shape);

    const text = new createjs.Text(num, 'bold 24px Andale Mono', SETTINGS.color);
    text.x = sx + (dx / 2) - 7;
    text.y = sy + (dy / 2) - 11;
    this.stage.addChild(text);
  }
}
