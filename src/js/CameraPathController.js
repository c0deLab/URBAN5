/** Class for controlling a 3D view mimicking a walk through of the model */
export default class CameraPathController {
  constructor(model, path) {
    this.model = model;
    this.r = 50;
    this.path = path;
    this.i = 0;
    this.views = [];

    // Start animation of path, after a delay to allow the page to render
    setTimeout(() => this.animateCameraPath(), 500);
  }

  addListener = view => this.views.push(view)

  removeListener = toRemove => this.views.filter(view => view !== toRemove)

  /** Every 500ms update the camera position of the views to the next in the path */
  animateCameraPath = () => {
    if (this.i < this.path.length - 1) {
      this.i += 1;
      const p = this.path[this.i];
      this.views.forEach(v => v.setCameraPosition(p));
    }
    setTimeout(() => this.animateCameraPath(), 500);
  }
}
