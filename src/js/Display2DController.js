import CamerasEnum from './enums/CamerasEnum';
import ActionsEnum from './enums/ActionsEnum';
import ObjectsEnum from './enums/ObjectsEnum';
import SurfacesEnum from './enums/SurfacesEnum';

/* global SETTINGS */

/** Class to control rotating to different slice angles and elevations and moving through slices */
export default class Display2DController {
  constructor(session) {
    this.session = session;

    this.gridSize = SETTINGS.gridSize;
    this.xMax = SETTINGS.xMax;
    this.yMax = SETTINGS.yMax;
    this.zMax = SETTINGS.zMax;

    this.sliceXAxis = 0; // for W/E view
    this.sliceYAxis = 0; // for N/S view
    this.sliceZAxis = 6; // for TOP/BOTTOM view
    this.views = [];
    this.isBackgroundDashed = true;

    this.north(); // By default, set to view looking north
  }

  addListener = view => this.views.push(view)

  removeListener = toRemove => this.views.filter(view => view !== toRemove)

  doAction = (action, clickX, clickY, modifier) => {
    const modelPosition = this.getRelativePosition(clickX, clickY);
    // Execute the currently selected action from the light button at the click location
    switch (action) {
      case ActionsEnum.STEPOUT:
        this.previousSlice();
        break;
      case ActionsEnum.STEPIN:
        this.nextSlice();
        break;
      case ActionsEnum.ADDCUBE:
        this.addObject(modelPosition, ObjectsEnum.CUBE);
        break;
      case ActionsEnum.REMOVE:
        this.removeObject(modelPosition);
        break;
      case ActionsEnum.ROTATELT:
        this.rotateLeft();
        break;
      case ActionsEnum.ADDTREE:
        this.addObject(modelPosition, ObjectsEnum.TREE);
        break;
      case ActionsEnum.ADD_ROOF_EAST:
        this.addObject(modelPosition, ObjectsEnum.ROOF, 'e');
        break;
      case ActionsEnum.ADD_ROOF_WEST:
        this.addObject(modelPosition, ObjectsEnum.ROOF, 'w');
        break;
      case ActionsEnum.ADD_ROOF_NORTH:
        this.addObject(modelPosition, ObjectsEnum.ROOF, 'n');
        break;
      case ActionsEnum.ADD_ROOF_SOUTH:
        this.addObject(modelPosition, ObjectsEnum.ROOF, 's');
        break;
      case ActionsEnum.EDITTOPO:
        this.setTopoHeight(modelPosition);
        break;
      case ActionsEnum.NO_SURFACE:
        this.setSurface(this.camera, modelPosition, modifier, SurfacesEnum.NONE);
        break;
      case ActionsEnum.SOLID_SURFACE:
        this.setSurface(this.camera, modelPosition, modifier, SurfacesEnum.SOLID);
        break;
      case ActionsEnum.TRANSPARENT_SURFACE:
        this.setSurface(this.camera, modelPosition, modifier, SurfacesEnum.TRANS);
        break;
      case ActionsEnum.PARTITION_SURFACE:
        this.setSurface(this.camera, modelPosition, modifier, SurfacesEnum.PART);
        break;
      default:
        // nothing
        break;
    }
    // if (modelPosition) {
    //   this.actionsAPI.onAction(action, { modelPosition });
    // }
  };

  /**
   * Add the object at the normalized position. Remove any object that is there.
   * @param {object} modelPosition - {x,y,z}
   */
  addObject = (modelPosition, object, modifier) => {
    if (modelPosition) {
      this.session.design.add(object, modelPosition, modifier);
      this.updateViews();
    }
  }

  /**
   * Remove the object at the normalized position.
   * @param {object} modelPosition - {x,y,z}
   */
  removeObject = modelPosition => {
    if (modelPosition) {
      this.session.design.remove(modelPosition);
      this.updateViews();
    }
  }

  /**
   */
  setSurface = (camera, position, side, surface) => {
    if (position) {
      this.session.design.setSurface(camera, position, side, surface);
      this.updateViews();
    }
  }

  // /**
  //  * Set the topo height at the normalized position. If there is no ground where you click, raise
  //  * to fill that area. If there is ground there, remove down to the base of that point
  //  * @param {object} modelPosition - {x,y,z}
  //  */
  // setTopoHeight = modelPosition => {
  //   if (modelPosition) {
  //     const { x, y, z } = modelPosition;
  //     const { topo } = this.model;

  //     let height;

  //     const currentHeight = topo.getTopoHeight({ x, y });
  //     if (z < currentHeight) {
  //       // If ground was previous full, Drop height down to base of click grid square
  //       height = z;
  //     } else {
  //       // Raise height to fill up the grid square if it was empty
  //       height = z + 1;
  //     }
  //     this.session.topo.setTopoHeight({ x, y }, height);
  //     this.updateViews();
  //   }
  // }

  /** Move the view to the next slice, without exceeding the last slice */
  nextSlice = () => {
    switch (this.camera) {
      case CamerasEnum.NORTH:
        this._setSliceYAxis(this.sliceYAxis + 1);
        break;
      case CamerasEnum.SOUTH:
        this._setSliceYAxis(this.sliceYAxis - 1);
        break;
      case CamerasEnum.EAST:
        this._setSliceXAxis(this.sliceXAxis + 1);
        break;
      case CamerasEnum.WEST:
        this._setSliceXAxis(this.sliceXAxis - 1);
        break;
      case CamerasEnum.TOP:
        this._setSliceZAxis(this.sliceZAxis - 1);
        break;
      case CamerasEnum.BOTTOM:
        this._setSliceZAxis(this.sliceZAxis + 1);
        break;
      default:
        throw new Error(`camera ${this.camera} is not recognized!`);
    }
  }

  /** Move the view to the previous slice, without going past 0 */
  previousSlice = () => {
    switch (this.camera) {
      case CamerasEnum.NORTH:
        this._setSliceYAxis(this.sliceYAxis - 1);
        break;
      case CamerasEnum.SOUTH:
        this._setSliceYAxis(this.sliceYAxis + 1);
        break;
      case CamerasEnum.EAST:
        this._setSliceXAxis(this.sliceXAxis - 1);
        break;
      case CamerasEnum.WEST:
        this._setSliceXAxis(this.sliceXAxis + 1);
        break;
      case CamerasEnum.TOP:
        this._setSliceZAxis(this.sliceZAxis + 1);
        break;
      case CamerasEnum.BOTTOM:
        this._setSliceZAxis(this.sliceZAxis - 1);
        break;
      default:
        throw new Error(`camera ${this.camera} is not recognized!`);
    }
  }

  /** Set the camera view to NORTH and reset the slice to 0 */
  north = () => this._setCamera('NORTH')

  /** Set the camera view to SOUTH and reset the slice to 0 */
  south = () => this._setCamera('SOUTH')

  /** Set the camera view to EAST and reset the slice to 0 */
  east = () => this._setCamera('EAST')

  /** Set the camera view to WEST and reset the slice to 0 */
  west = () => this._setCamera('WEST')

  /** Set the camera view to TOP and reset the slice to 0 */
  top = () => this._setCamera('TOP')

  /** Set the camera view to BOTTOM and reset the slice to 0 */
  bottom = () => this._setCamera('BOTTOM')

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
  }

  rotateRight = () => {
    switch (this.camera) {
      case CamerasEnum.NORTH:
        this._setCamera('WEST');
        break;
      case CamerasEnum.WEST:
        this._setCamera('SOUTH');
        break;
      case CamerasEnum.SOUTH:
        this._setCamera('EAST');
        break;
      case CamerasEnum.EAST:
        this._setCamera('NORTH');
        break;
      default:
        // do nothing for top and bottom
    }
  }

  /**
   * Set the slice in view in the Z axis, only runs if a legal slice
   * @param {int} slice - number of slice
   */
  _setSliceZAxis = slice => {
    if (slice >= 0 && slice < this.zMax) {
      this.sliceZAxis = slice;
      this.updateViews();
    }
  }

  /**
   * Set the slice in view in the X axis, only runs if a legal slice
   * @param {int} slice - number of slice
   */
  _setSliceXAxis = slice => {
    if (slice >= 0 && slice < this.xMax) {
      this.sliceXAxis = slice;
      this.updateViews();
    }
  }

  /**
   * Set the slice in view in the Y axis, only runs if a legal slice
   * @param {int} slice - number of slice
   */
  _setSliceYAxis = slice => {
    if (slice >= 0 && slice < this.yMax) {
      this.sliceYAxis = slice;
      this.updateViews();
    }
  }

  /**
   * Set the camera view to the given view and reset the slice to 0
   * @param {String} camera - CamerasEnum name
   */
  _setCamera = camera => {
    this.camera = CamerasEnum[camera];
    this.updateViews();
  }

  /** Draw the current view from the current camera angle and sliceIndex */
  updateViews = () => {
    let sliceIndex;
    switch (this.camera) {
      case CamerasEnum.NORTH:
      case CamerasEnum.SOUTH:
        sliceIndex = this.sliceYAxis;
        break;
      case CamerasEnum.EAST:
      case CamerasEnum.WEST:
        sliceIndex = this.sliceXAxis;
        break;
      case CamerasEnum.TOP:
      case CamerasEnum.BOTTOM:
        sliceIndex = this.sliceZAxis;
        break;
      default:
        throw new Error(`camera ${this.camera} is not recognized!`);
    }

    this.views.forEach(v => v.draw(this.camera, sliceIndex, this.isBackgroundDashed));
  }

  /**
   * Returns a 3D vector of the model position based on the normalized click
   * @param {float} clickX - Normalized x between 0 and 1
   * @param {float} clickY - Normalized y between 0 and 1
   */
  getRelativePosition = (x, y) => {
    // Check that it is a legal 3D index
    switch (this.camera) {
      case CamerasEnum.NORTH:
      case CamerasEnum.SOUTH:
      case CamerasEnum.EAST:
      case CamerasEnum.WEST:
        if (y >= this.zMax) {
          return null;
        }
        break;
      default:
        // do nothing
    }

    // translate this position along with the current slice to the 3D model indeces
    switch (this.camera) {
      case CamerasEnum.NORTH:
        return { x, y: this.sliceYAxis, z: y };
      case CamerasEnum.SOUTH:
        return { x: this.gridSize - 1 - x, y: this.sliceYAxis, z: y };
      case CamerasEnum.EAST:
        return { x: this.sliceXAxis, y: this.gridSize - 1 - x, z: y };
      case CamerasEnum.WEST:
        return { x: this.sliceXAxis, y: x, z: y };
      case CamerasEnum.BOTTOM:
        return { x, y: this.gridSize - 1 - y, z: this.sliceZAxis };
      case CamerasEnum.TOP:
        return { x, y, z: this.sliceZAxis };
      default:
        throw new Error(`camera ${this.camera} is not recognized!`);
    }
  }
}
