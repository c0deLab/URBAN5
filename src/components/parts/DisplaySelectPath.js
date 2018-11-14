import React from 'react';
import PropTypes from 'prop-types';

import SliceView from '../../js/SliceView';
import DesignController from '../../js/DesignController';

export default class DisplaySelectPath extends React.Component {
  static propTypes = {
    action: PropTypes.number,
    controller: PropTypes.object,
    model: PropTypes.object
  }

  componentDidMount() {
    this.isWired = false;

    this.canvas = document.getElementById('canvas');
    this.canvas.addEventListener('click', this.handleClick);
    this.wire();
  }

  componentDidUpdate() {
    this.wire();
  }

  componentWillUnmount() {
    this.canvas.removeEventListener('click', this.handleClick);
  }

  wire = () => {
    const { model, controller } = this.props;
    if (this.isWired || !model) {
      return;
    }

    this.controller = new DesignController(model);
    this.isWired = true;

    this.width = 852;
    this.height = 852;

    if (!model || !controller) {
      return;
    }

    this.view = new SliceView(this.canvas, model);
    this.controller.addListener(this.view);
    this.controller.top();
    this.start = null;
    this.end = null;

    this.controller.updateViews();
  };

  handleClick = event => {
    // There is a 1px padding around the edges to not get cut off
    if (event.offsetX === 0 || event.offsetX === 851) {
      return;
    }
    const clickX = (event.offsetX - 1) / this.width;
    const clickY = (event.offsetY - 1) / this.height;

    const position = this.controller.getRelativePosition(clickX, clickY);
    if (position) {
      const {
        x, y
      } = position;

      if (!this.start) {
        this.start = [x, y];
        console.log('start', this.start);
      } else {
        this.end = [x, y];
        console.log('end', this.end);
      }
    }
  }

  render() {
    return (
      <canvas id="canvas" width={852} height={852} />
    );
  }
}
