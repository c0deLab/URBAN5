import React from 'react';
import DesignModel from '../../js/DesignModel';
import DesignRenderer from '../../js/DesignRenderer';
import { createjs } from '@createjs/easeljs';
import ActionsEnum from '../../js/ActionsEnum';
import ObjectsEnum from '../../js/ObjectsEnum';

export default class DesignViewer extends React.Component {

  componentDidMount() {
    const container = document.getElementById('canvas');
    const stage = new createjs.Stage(container);

    // Add class to recieve inputs and update and store model
    this.designModel = new DesignModel(17, 7, 17);

    // Add class to create new scene or update scene as user makes changes (also responsible for line vs. dotted line rendering)
    this.designRenderer = new DesignRenderer(this.designModel, stage);

    document.addEventListener('keydown', this.handleKeyDown);
    container.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    return (
      <canvas id="canvas" width={852} height={852}></canvas>
    );
  }

  handleKeyDown = (event) => {
    console.log(event.keyCode);
    switch(event.keyCode) {
      case 87: // w
        this.designRenderer.north();
        break;
      case 88: // x
        this.designRenderer.south();
        break;
      case 65: // a
        this.designRenderer.west();
        break;
      case 68: // d
        this.designRenderer.east();
        break;
      case 83: // s
        this.designRenderer.top();
        break;
      case 67: // f
        this.designRenderer.bottom();
        break;
      case 38: // up
        this.designRenderer.nextSlice();
        break;
      case 40: // down
        this.designRenderer.previousSlice();
        break;
      default: 
        break;
    }
  }

  handleClick = (event) => {
    let clickX = event.offsetX;
    let clickY = event.offsetY;

    const modelPosition = this.designRenderer.getPosition(clickX, clickY);

    switch(this.props.action) {
      case ActionsEnum.STEPOUT:
        this.designRenderer.previousSlice();
        break;
      case ActionsEnum.STEPIN:
        this.designRenderer.nextSlice();
        break;
      case ActionsEnum.ADDCUBE:
        this.designModel.addObject(modelPosition, ObjectsEnum.CUBE);
        this.designRenderer.updateStage();
        break;
      case ActionsEnum.REMVCUBE:
        this.designModel.addObject(modelPosition);
        this.designRenderer.updateStage();
        break;
      default: 
        // nothing
        break;
    }
  }
}