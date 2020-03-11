import { stepsPer } from '../helpers/CalculatePath';

/** Class for controlling a 3D view mimicking a walk through of the model */
export default class CameraPathController {
  constructor(session, onWalkthroughEnd) {
    this.session = session;
    this.views = [];
    this.onWalkthroughEnd = onWalkthroughEnd;
  }

  addListener = view => this.views.push(view)

  removeListener = toRemove => this.views.filter(view => view !== toRemove)

  run = path => {
    this.path = path;
    this.i = 0;

    // Start animation of path, after a delay to allow the page to render
    setTimeout(() => this.animateCameraPath(), 500);
  }

  /** Every X ms update the camera position of the views to the next in the path */
  animateCameraPath = () => {
    if (this.i < this.path.length - 2) {
      this.i += 1;
      const p = this.path[this.i];
      const direction = this.path[this.path.length - 1];
      this.views.forEach(v => v.setCameraPosition(p, direction));
      setTimeout(() => this.animateCameraPath(), 300 / stepsPer);
    } else {
      this.onWalkthroughEnd();
    }
  }
}
