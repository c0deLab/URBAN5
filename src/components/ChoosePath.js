import React from 'react';
import PropTypes from 'prop-types';

import Display2DView from '../js/Display2DView';
import { getGridPointInModelSpace } from '../js/helpers/Helpers';

/* global document */
/* global SETTINGS */

/** Class for t */
export default class ChoosePath extends React.Component {
  static propTypes = {
    session: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    onSelectStart: PropTypes.func.isRequired, // eslint-disable-line react/forbid-prop-types
    onSelectEnd: PropTypes.func.isRequired, // eslint-disable-line react/forbid-prop-types
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
    const { session } = this.props;
    // Only wire once, and only do it once the model is ready
    if (this.isWired || !session) {
      return;
    }
    this.isWired = true;

    this.view = new Display2DView(this.canvas, session);
    // Trigger initial render
    this.view.drawTopCompressedView();
  }

  handleClick = event => {
    const { hasStart } = this.state;
    const { onSelectStart, onSelectEnd } = this.props;

    const point = getGridPointInModelSpace(event.offsetX, event.offsetY);
    if (!point) {
      return;
    }

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

  render() {
    const { w, h } = SETTINGS;
    return (
      <div>
        <canvas id="display" width={w} height={h} />
      </div>
    );
  }
}
