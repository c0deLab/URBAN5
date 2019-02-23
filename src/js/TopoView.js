import { createjs } from '@createjs/easeljs';

import EditTopoRenderer2D from './renderers/EditTopoRenderer2D';

/* global SETTINGS */

/** Class responsible for rednering a 2D slice */
export default class TopoView {
  constructor(canvas, session) {
    this.session = session;
    this.stage = new createjs.Stage(canvas);

    this.renderer = new EditTopoRenderer2D(this.stage);
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

    for (let y = 0; y < SETTINGS.yMax; y += 1) {
      for (let x = 0; x < SETTINGS.xMax; x += 1) {
        this.renderer.drawSquare(x, y, this.session.topo.getAt({ x, y }));
      }
    }

    // Render to the screen
    this.stage.update();
  };
}
