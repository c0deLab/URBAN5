import React from 'react';
import PropTypes from 'prop-types';

import Display2DView from '../js/Display2DView';

/* global document */

/** Class for t */
export default class ChoosePath extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    hasStart: false
  }

  componentDidMount() {
    this.isWired = false;

    this.canvas = document.getElementById('display');
    this.canvas.addEventListener('click', this.handleClick);

    // If the model had already been created, immediately wire
    this.wire();
  }

  componentDidUpdate() {
    // When the model is created, we need to wire it
    this.wire();
  }

  componentWillUnmount() {
    this.canvas.removeEventListener('click', this.handleClick);
  }

  /**
   * This should be called one time once the HTML element and the model are ready.
   * It sets up the rendering to the canvas.
   */
  wire = () => {
    const { model } = this.props;
    // Only wire once, and only do it once the model is ready
    if (this.isWired || !model) {
      return;
    }
    this.isWired = true;

    this.view = new Display2DView(this.canvas, model);
    // Trigger initial render
    this.view.drawTopCompressedView();
  }

  handleClick = event => {
    const { hasStart } = this.state;
    const { onSelectStart, onSelectEnd } = this.props;
    // There is a 1px padding around the edges to not cut off the graphics awkwardly
    // Ignore clicks in that range
    if (event.offsetX === 0 || event.offsetX === (this.width - 1)
        || event.offsetY === 0 || event.offsetY === (this.height - 1)) {
      return;
    }

    // Offset click for 1px padding and find normalized position
    const normalizedX = (event.offsetX - 1) / this.width;
    const normalizedY = (event.offsetY - 1) / this.height;

    const point = this.getRelativePosition(normalizedX, normalizedY);
    if (!hasStart) {
      onSelectStart(point);
      this.setState({ hasStart: true });
      this.view.drawCircle(point.x, point.y);
      this.view.update();
    } else {
      this.view.drawCircle(point.x, point.y);
      this.view.update();
      setTimeout(() => {
        onSelectEnd(point);
      }, 1000);
    }
  }

  /**
   * Returns a 3D vector of the model position based on the normalized click
   * @param {float} clickX - Normalized x between 0 and 1
   * @param {float} clickY - Normalized y between 0 and 1
   */
  getRelativePosition = (clickX, clickY) => {
    // get the x, y position in the scale of the model
    const gridSize = 17;
    const x = Math.floor(clickX * gridSize);
    const y = gridSize - 1 - Math.floor(clickY * gridSize);
    return { x, y };
  }

  render() {
    this.width = 852;
    this.height = 852;
    return (
      <div>
        <canvas id="display" width={this.width} height={this.height} />
      </div>
    );
  }
}
