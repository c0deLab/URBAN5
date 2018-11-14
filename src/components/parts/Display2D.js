import React from 'react';
import PropTypes from 'prop-types';

import ActionsEnum from '../../js/enums/ActionsEnum';
import ObjectsEnum from '../../js/enums/ObjectsEnum';
import SliceView from '../../js/SliceView';

export default class Display2D extends React.Component {
  static propTypes = {
    action: PropTypes.number,
    controller: PropTypes.object,
    model: PropTypes.object
  }

  componentDidMount() {
    this.isWired = false;

    this.canvas = document.getElementById('canvas');
    document.addEventListener('keydown', this.handleKeyDown);
    this.canvas.addEventListener('click', this.handleClick);
    this.wire();
  }

  componentDidUpdate() {
    this.wire();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.canvas.removeEventListener('click', this.handleClick);
  }

  wire = () => {
    const { model, controller } = this.props;
    if (this.isWired || !model) {
      return;
    }
    this.isWired = true;

    this.width = 852;
    this.height = 852;

    if (!model || !controller) {
      return;
    }

    const view = new SliceView(this.canvas, model);
    controller.addListener(view);

    controller.updateViews();
  };

  handleKeyDown = event => {
    const { controller } = this.props;
    console.log(event.keyCode);

    switch (event.keyCode) {
      case 87: // w
        controller.south();
        break;
      case 88: // x
        controller.north();
        break;
      case 65: // a
        controller.east();
        break;
      case 68: // d
        controller.west();
        break;
      case 83: // s
        controller.top();
        break;
      case 67: // f
        controller.bottom();
        break;
      case 38: // up
        controller.nextSlice();
        break;
      case 40: // down
        controller.previousSlice();
        break;
      default:
        break;
    }
  }

  handleClick = event => {
    const { controller } = this.props;
    // There is a 1px padding around the edges to not get cut off
    if (event.offsetX === 0 || event.offsetX === 851) {
      return;
    }
    const clickX = (event.offsetX - 1) / this.width;
    const clickY = (event.offsetY - 1) / this.height;

    const { action } = this.props;
    switch (action) {
      case ActionsEnum.STEPOUT:
        controller.previousSlice();
        break;
      case ActionsEnum.STEPIN:
        controller.nextSlice();
        break;
      case ActionsEnum.ADDCUBE:
        controller.addObject(clickX, clickY, ObjectsEnum.CUBE);
        break;
      case ActionsEnum.REMOVE:
        controller.removeObject(clickX, clickY);
        break;
      case ActionsEnum.ROTATELT:
        controller.rotateLeft();
        break;
      case ActionsEnum.ADDTREE:
        controller.addObject(clickX, clickY, ObjectsEnum.TREE);
        break;
      case ActionsEnum.ADDRFLFT:
        controller.addObject(clickX, clickY, ObjectsEnum.ROOFLEFT);
        break;
      case ActionsEnum.ADDRFRGT:
        controller.addObject(clickX, clickY, ObjectsEnum.ROOFRGHT);
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
