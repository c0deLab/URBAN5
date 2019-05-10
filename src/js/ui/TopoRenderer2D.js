import { createjs } from '@createjs/easeljs';

/* global SETTINGS */

export default class TopoRenderer2D {
  constructor(stage) {
    this.stage = stage;
  }

  draw = (topoSlice, isBackground) => {
    const line = new createjs.Shape();
    let cornerX;
    let cornerY;

    // Draw the heights left to right as a connected line
    cornerX = 1;
    line.graphics.beginStroke(SETTINGS.color).setStrokeStyle(SETTINGS.stroke);

    if (isBackground) {
      line.graphics.setStrokeDash([4, 8], 0);
    }

    topoSlice.all.forEach(s => {
      const [ startHeight, endHeight ] = s;
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
