import Display2DView from './Display2DView';
import CamerasEnum from './enums/CamerasEnum';

export class TestViewSliceOffset {
  constructor(canvas, model, sliceOffset) {
    this.view = new Display2DView(canvas, model);
    this.sliceOffset = sliceOffset;
    this.canvas = canvas;
  }

  draw = (camera, sliceIndex) => {
    const sliceIndexOffset = sliceIndex + this.sliceOffset;
    switch (camera) {
      case CamerasEnum.SOUTH:
      case CamerasEnum.NORTH:
      case CamerasEnum.WEST:
      case CamerasEnum.EAST:
        if (sliceIndexOffset >= 0 && sliceIndexOffset < 17) {
          this.view.draw(camera, sliceIndexOffset);
        } else {
          const ctx = this.canvas.getContext('2d');
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        break;
      case CamerasEnum.BOTTOM:
      case CamerasEnum.TOP:
        if (sliceIndexOffset >= 0 && sliceIndexOffset < 7) {
          this.view.draw(camera, sliceIndexOffset);
        } else {
          const ctx = this.canvas.getContext('2d');
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        break;
      default:
        throw new Error(`camera ${camera} is not recognized!`);
    }
  };
}

export class TestViewCameraSlice {
  constructor(canvas, model, controller, camera, sliceIndex) {
    this.view = new Display2DView(canvas, model);
    this.camera = camera;
    this.sliceIndex = sliceIndex;
    this.controller = controller;
    this.view.drawBackground = false;
  }

  draw = () => {
    let currentSliceIndex;
    switch (this.camera) {
      case CamerasEnum.SOUTH:
      case CamerasEnum.NORTH:
        currentSliceIndex = this.controller.sliceYAxis;
        break;
      case CamerasEnum.WEST:
      case CamerasEnum.EAST:
        currentSliceIndex = this.controller.sliceXAxis;
        break;
      case CamerasEnum.BOTTOM:
      case CamerasEnum.TOP:
        currentSliceIndex = this.controller.sliceZAxis;
        break;
      default:
        throw new Error(`camera ${this.camera} is not recognized!`);
    }
    if (currentSliceIndex === this.sliceIndex) {
      this.view.color = '#ff0000';
    } else {
      this.view.color = '#ffffff';
    }
    this.view.draw(this.camera, this.sliceIndex);
  }
}

export class TestViewCamera {
  constructor(canvas, model, controller, camera, axisLabel) {
    this.view = new Display2DView(canvas, model);
    this.controller = controller;
    this.camera = camera;
    this.axisLabel = axisLabel;
    this.view.drawBackground = false;
  }

  draw = () => this.view.draw(this.camera, this.controller[this.axisLabel]);
}
