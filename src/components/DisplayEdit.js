import React from 'react';
import PropTypes from 'prop-types';

import Display2DView from '../js/Display2DView';
import Display2DController from '../js/Display2DController';
import DebuggingDisplays from '../debugging/DebuggingDisplays';

/* global document */

/** Class for the 2D slice views */
export default class DisplayEdit extends React.Component {
  static propTypes = {
    action: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    model: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    actionsAPI: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    controller: null,
    showDebug: false
  }

  componentDidMount() {
    this.isWired = false;

    this.canvas = document.getElementById('display2D');
    document.addEventListener('keydown', this.handleKeyDown);
    this.canvas.addEventListener('click', this.handleClick);

    // If the model had already been created, immediately wire
    this.wire();
  }

  componentDidUpdate() {
    // When the model is created, we need to wire it
    this.wire();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
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
    const { controller, showDebug } = this.state;

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
      case 80: // p
        this.setState({
          showDebug: !showDebug
        });
        break;
      default:
        break;
    }
  }

  handleClick = event => {
    const { controller } = this.state;
    // There is a 1px padding around the edges to not cut off the graphics awkwardly
    // Ignore clicks in that range
    if (event.offsetX === 0 || event.offsetX === (this.width - 1)
        || event.offsetY === 0 || event.offsetY === (this.height - 1)) {
      return;
    }

    // Offset click for 1px padding and find normalized position
    const normalizedX = (event.offsetX - 1) / this.width;
    const normalizedY = (event.offsetY - 1) / this.height;

    const { action } = this.props;
    controller.doAction(action, normalizedX, normalizedY);
  }

  render() {
    const { controller, showDebug } = this.state;
    const { model } = this.props;

    this.width = 852;
    this.height = 852;
    return (
      <div>
        <canvas id="display2D" width={this.width} height={this.height} />
        {showDebug && model && controller ? (<DebuggingDisplays controller={controller} model={model} />) : null}
      </div>
    );
  }
}