import CamerasEnum from './enums/CamerasEnum';
import DesignModel from './DesignModel';
import SliceView from './SliceView';

/**
 *
 */
export default class DesignController {
  constructor(stage) {
    const resolution = 50;
    this.gridSize = 17;
    this.model = new DesignModel(17, 7, 17);
    this.view = new SliceView(stage, resolution);
    this.south(); // default this.camera = 'SOUTH';
  }

  /**
   * Add the object at the normalized position. Remove any object that is there.
   * @param {int} clickX - Normalized x value [0,1]
   * @param {int} clickY - Normalized y value [0,1]
   * @param {int} object - ObjectsEnum object
   */
  addObject = (clickX, clickY, object) => {
    this.removeObject(clickX, clickY);
    const modelPosition = this._getRelativePosition(clickX, clickY);
    this.model.addObject(modelPosition, object);
    this._updateView();
  };

  /**
   * Remove the object at the normalized position.
   * @param {int} clickX - Normalized x value [0,1]
   * @param {int} clickY - Normalized y value [0,1]
   */
  removeObject = (clickX, clickY) => {
    const modelPosition = this._getRelativePosition(clickX, clickY);
    this.model.removeObject(modelPosition);
    this._updateView();
  };

  /** Move the view to the next slice, without exceeding the last slice */
  nextSlice = () => this._setSlice(this.slice + 1);

  /** Move the view to the previous slice, without going past 0 */
  previousSlice = () => this._setSlice(this.slice - 1);

  /** Set the camera view to NORTH and reset the slice to 0 */
  north = () => this._setCamera('NORTH');

  /** Set the camera view to SOUTH and reset the slice to 0 */
  south = () => this._setCamera('SOUTH');

  /** Set the camera view to EAST and reset the slice to 0 */
  east = () => this._setCamera('EAST');

  /** Set the camera view to WEST and reset the slice to 0 */
  west = () => this._setCamera('WEST');

  /** Set the camera view to TOP and reset the slice to 0 */
  top = () => this._setCamera('TOP');

  /** Set the camera view to BOTTOM and reset the slice to 0 */
  bottom = () => this._setCamera('BOTTOM');

  rotateLeft = () => {
    switch (this.camera) {
      case CamerasEnum.NORTH:
        this._setCamera('EAST');
        break;
      case CamerasEnum.EAST:
        this._setCamera('SOUTH');
        break;
      case CamerasEnum.SOUTH:
        this._setCamera('WEST');
        break;
      case CamerasEnum.WEST:
        this._setCamera('NORTH');
        break;
      default:
        // do nothing for top and bottom
    }
  };

  /**
   * Set the slice in view, only runs if a legal slice
   * @param {int} slice - number of slice
   */
  _setSlice = slice => {
    if (slice >= 0 && slice < this.sliceMax) {
      this.slice = slice;
      this._updateView();
    }
    console.log('current slice: ' + this.slice);
  };

  /**
   * Set the camera view to the given view and reset the slice to 0
   * @param {String} view - CamerasEnum name
   */
  _setCamera = camera => {
    console.log(camera);
    this.camera = CamerasEnum[camera];
    this.slice = 0;

    switch (this.camera) {
      case CamerasEnum.NORTH:
      case CamerasEnum.SOUTH:
        this.sliceMax = this.model.zMax;
        break;
      case CamerasEnum.WEST:
      case CamerasEnum.EAST:
        this.sliceMax = this.model.xMax;
        break;
      case CamerasEnum.TOP:
      case CamerasEnum.BOTTOM:
        this.sliceMax = this.model.yMax;
        break;
      default:
        throw new Error(`camera ${this.camera} is not recognized!`);
    }
    this._updateView();
  };

  /** Add the background and current slice objects to the scene based on the current view and slice */
  _updateView = () => {
    const backgroundSlice = this.model.getBackgroundSlice(this.camera, this.slice);
    const currentSlice = this.model.getSlice(this.camera, this.slice);

    // Print currentSlice to console
    // Source: https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
    const transpose = m => m[0].map((x, i) => m.map(x => x[i]));
    console.table(transpose(currentSlice));

    this.view.drawCurrentView(this.camera, currentSlice, backgroundSlice);
  };

  /**
   *
   * @param {float} x - Normalized x between 0 and 1
   * @param {float} y - Normalized y between 0 and 1
   */
  _getRelativePosition = (clickX, clickY) => {
    // get the x, y position in the scale of the model
    const x = Math.floor(clickX * this.gridSize);
    const y = this.gridSize - 1 - Math.floor(clickY * this.gridSize);

    let modelX;
    let modelY;
    let modelZ;

    // translate this position along with the current slice to the 3D model indeces
    switch (this.camera) {
      case CamerasEnum.SOUTH:
        modelX = x;
        modelY = y;
        modelZ = this.slice;
        break;
      case CamerasEnum.NORTH:
        modelX = this.gridSize - 1 - x;
        modelY = y;
        modelZ = this.sliceMax - 1 - this.slice;
        break;
      case CamerasEnum.WEST:
        modelX = this.slice;
        modelY = this.cameraSize - 1 - y;
        modelZ = x;
        break;
      case CamerasEnum.EAST:
        modelX = this.sliceMax - 1 - this.slice;
        modelY = this.cameraSize - 1 - y;
        modelZ = this.gridSize - 1 - x;
        break;
      case CamerasEnum.TOP:
        modelX = x;
        modelY = this.sliceMax - 1 - this.slice;
        modelZ = this.cameraSize - 1 - y;
        break;
      case CamerasEnum.BOTTOM:
        modelX = x;
        modelY = this.slice;
        modelZ = y;
        break;
      default:
        throw new Error(`camera ${this.camera} is not recognized!`);
    }

    // Check that it is a legal 3D index
    switch (this.camera) {
      case CamerasEnum.SOUTH:
      case CamerasEnum.NORTH:
      case CamerasEnum.WEST:
      case CamerasEnum.EAST:
        if (modelY >= this.model.yMax) {
          return null;
        }
        break;
      default:
        // do nothing
    }

    return { x: modelX, y: modelY, z: modelZ };
  };

}
