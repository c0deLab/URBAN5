import React from 'react';
import PropTypes from 'prop-types';
import { createjs } from '@createjs/easeljs';

import DesignController from '../../js/DesignController';
import ActionsEnum from '../../js/enums/ActionsEnum';
import ObjectsEnum from '../../js/enums/ObjectsEnum';

export default class Design extends React.Component {
  static propTypes = {
    action: PropTypes.number.isRequired
  }

  componentDidMount() {
    const container = document.getElementById('canvas');
    this.width = 852;
    this.height = 852;

    const stage = new createjs.Stage(container);
    this.designController = new DesignController(stage);

    document.addEventListener('keydown', this.handleKeyDown);
    container.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = event => {
    console.log(event.keyCode);

    switch (event.keyCode) {
      case 87: // w
        this.designController.north();
        break;
      case 88: // x
        this.designController.south();
        break;
      case 65: // a
        this.designController.west();
        break;
      case 68: // d
        this.designController.east();
        break;
      case 83: // s
        this.designController.top();
        break;
      case 67: // f
        this.designController.bottom();
        break;
      case 38: // up
        this.designController.nextSlice();
        break;
      case 40: // down
        this.designController.previousSlice();
        break;
      default:
        break;
    }
  }

  handleClick = event => {
    // There is a 1px padding around the edges to not get cut off
    if (event.offsetX === 0 || event.offsetX === 851) {
      return;
    }
    const clickX = (event.offsetX - 1) / this.width;
    const clickY = (event.offsetY - 1) / this.height;

    const { action } = this.props;
    switch (action) {
      case ActionsEnum.STEPOUT:
        this.designController.previousSlice();
        break;
      case ActionsEnum.STEPIN:
        this.designController.nextSlice();
        break;
      case ActionsEnum.ADDCUBE:
        this.designController.addObject(clickX, clickY, ObjectsEnum.CUBE);
        break;
      case ActionsEnum.REMOVE:
        this.designController.removeObject(clickX, clickY);
        break;
      case ActionsEnum.ROTATELT:
        this.designController.rotateLeft();
        break;
      case ActionsEnum.ADDTREE:
        this.designController.addObject(clickX, clickY, ObjectsEnum.TREE);
        break;
      case ActionsEnum.ADDRFLFT:
        this.designController.addObject(clickX, clickY, ObjectsEnum.ROOFLEFT);
        break;
      case ActionsEnum.ADDRFRGT:
        this.designController.addObject(clickX, clickY, ObjectsEnum.ROOFRGHT);
        break;
      default:
        // nothing
        break;
    }
  }

  render() {
    return (
      <canvas id="canvas" width={852} height={852} />
    );
  }
}
