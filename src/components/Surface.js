import React from 'react';
import PropTypes from 'prop-types';

import Display2DView from '../js/Display2DView';
import Display2DController from '../js/Display2DController';
import { getGridPointInModelSpace } from '../js/Helpers';

/* global document */
/* global SETTINGS */

export default class Surface extends React.Component {
  static propTypes = {
    action: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    model: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    actionsAPI: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    controller: null
  }

  componentDidMount() {
    this.isWired = false;

    this.canvas = document.getElementById('display2D');
    this.canvas.addEventListener('keydown', this.handleKeyDown);
    this.canvas.addEventListener('click', this.handleClick);

    // If the model had already been created, immediately wire
    this.wire();
  }

  componentDidUpdate() {
    // When the model is created, we need to wire it
    this.wire();
  }

  componentWillUnmount() {
    this.canvas.removeEventListener('keydown', this.handleKeyDown);
    this.canvas.removeEventListener('click', this.handleClick);
  }

  /**
   * This should be called one time once the HTML element and the model are ready.
   * It sets up the rendering to the canvas.
   */
  wire = () => {
    const { model, actionsAPI } = this.props;
    // Only wire once, and only do it once the model is ready
    if (this.isWired || !model) {
      return;
    }
    this.isWired = true;

    // Create controller and 2D slice view
    const controller = new Display2DController(model, actionsAPI);
    this.view = new Display2DView(this.canvas, model);
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
        <canvas id="display2D" width={w} height={h} />
      </div>
    );
  }
}
