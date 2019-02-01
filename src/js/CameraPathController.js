/** Class for controlling a 3D view mimicking a walk through of the model */
export default class CameraPathController {
  constructor(model, onWalkthroughEnd) {
    this.model = model;
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

  /** Every 500ms update the camera position of the views to the next in the path */
  animateCameraPath = () => {
    if (this.i < this.path.length - 2) {
      this.i += 1;
      const p = this.path[this.i];
      const nextP = this.path[this.i + 1];
      this.views.forEach(v => v.setCameraPosition(p, nextP));
      setTimeout(() => this.animateCameraPath(), 300);
    } else {
      this.onWalkthroughEnd();
    }
  }
}
