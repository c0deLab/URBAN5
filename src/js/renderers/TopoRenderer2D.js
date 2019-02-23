import { createjs } from '@createjs/easeljs';

/* global SETTINGS */

export default class TopoRenderer2D {
  constructor(stage) {
    this.stage = stage;
  }

  draw = topoSlice => {
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
  }
}
