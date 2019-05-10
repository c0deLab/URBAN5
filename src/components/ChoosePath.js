import React from 'react';
import PropTypes from 'prop-types';

import Display2DView from '../js/ui/Display2DView';
import { getGridPointInModelSpace } from '../js/helpers/Helpers';
import calculatePath from '../js/helpers/CalculatePath';

/* global document */
/* global SETTINGS */

/** Class for t */
export default class ChoosePath extends React.Component {
  static propTypes = {
    session: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    onSelectPath: PropTypes.func.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    hasStart: false
  }

  componentDidMount() {
    this.isWired = false;

    this.canvas = document.getElementById('display');
    this.canvas.addEventListener('mousedown', this.handleClick);
    this.start = null;
    this.end = null;

    // If the model had already been created, immediately wire
    this.wire();
  }

  componentDidUpdate() {
    // When the model is created, we need to wire it
    this.wire();
  }

  componentWillUnmount() {
    this.canvas.removeEventListener('mousedown', this.handleClick);
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
    const { onSelectPath, session } = this.props;

    const point = getGridPointInModelSpace(event.offsetX, event.offsetY);
    if (!point) {
      return;
    }

    if (session.design.getAt({ x: point.x, y: point.y, z: 0 })) {
      return;
    }

    if (!hasStart) {
      this.setState({ hasStart: true });
      this.view.drawCircle(point.x, point.y);
      this.view.update();
      this.start = point;
    } else if (this.start.x !== point.x || this.start.y !== point.y) {
      this.view.drawCircle(point.x, point.y);
      this.view.update();
      this.end = point;
      const path = calculatePath(session, this.start, this.end);

      if (!path) {
        console.log('No path');
        this.start = null;
        this.end = null;
        this.setState({ hasStart: false });
        return;
      }

      // do 2D walkthrough
      const callback = () => {
        this.start = null;
        this.end = null;
        this.setState({ hasStart: false });
        onSelectPath(path);
      };
      const speed = 75;
      this.view.animateX(path, 0, speed, callback);
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
