import React from 'react';
import PropTypes from 'prop-types';

import Display2DView from '../js/ui/Display2DView';
import Display2DController from '../js/ui/Display2DController';
import ActionsEnum from '../js/enums/ActionsEnum';
import { getGridPointInModelSpace } from '../js/helpers/Helpers';

/* global document */
/* global SETTINGS */

/** Class for the 2D slice views */
export default class Draw extends React.Component {
  static propTypes = {
    action: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    session: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    controller: null
  }

  componentDidMount() {
    this.isWired = false;

    this.canvas = document.getElementById('draw');
    document.addEventListener('keydown', this.handleKeyDown);
    this.canvas.addEventListener('mousedown', this.handleClick);

    // If the model had already been created, immediately wire
    this.wire();
  }

  componentDidUpdate() {
    // When the model is created, we need to wire it
    this.wire();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.canvas.removeEventListener('mousedown', this.handleClick);
  }

  /**
   * This should be called one time once the HTML element and the model are ready.
   * It sets up the rendering to the canvas.
   */
  wire = () => {
    const { session, cameraView } = this.props;
    // Only wire once, and only do it once the model is ready
    if (this.isWired || !session) {
      return;
    }
    this.isWired = true;

    // Create controller and 2D slice view
    const controller = new Display2DController(session, cameraView);
    this.view = new Display2DView(this.canvas, session);
    controller.addListener(this.view);
    // Trigger initial render
    controller.updateViews();

    this.setState({
      controller
    });
  }

  /** Add some hotkeys to make testing easier */
  handleKeyDown = event => {
    const { controller } = this.state;

    const { action } = this.props;
    if (action === ActionsEnum.SPEAK_CONSTRAINT) {
      return; // text area has control
    }

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
      case 38: // up arrow
        controller.nextSlice();
        break;
      case 40: // down arrow
        controller.previousSlice();
        break;
      default:
        break;
    }
  }

  handleClick = event => {
    const { controller } = this.state;
    const { action } = this.props;
    console.log(action);
    const point = getGridPointInModelSpace(event.offsetX, event.offsetY);
    if (!point) {
      return;
    }
    controller.doAction(action, point.x, point.y);
  }

  render() {
    const { w, h } = SETTINGS;

    return (
      <div>
        <canvas id="draw" width={w} height={h} />
      </div>
    );
  }
}
