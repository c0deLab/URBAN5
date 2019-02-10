import React from 'react';
import PropTypes from 'prop-types';

import TopoView from '../js/TopoView';
import { getGridPointInModelSpace } from '../js/Helpers';
import ActionsEnum from '../js/enums/ActionsEnum';

/* global document */
/* global SETTINGS */

/** Class for t */
export default class Topo extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    action: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
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

    this.view = new TopoView(this.canvas, model.topo);
    // Trigger initial render
    this.view.draw();
  }

  handleClick = event => {
    const { model, action } = this.props;
    const point = getGridPointInModelSpace(event.offsetX, event.offsetY);
    if (!point) {
      return;
    }

    const currentHeight = model.topo.getTopoHeight(point);
    if (action === ActionsEnum.DECREASE_HEIGHT) {
      model.topo.setTopoHeight(point, currentHeight - 1);
    } else {
      model.topo.setTopoHeight(point, currentHeight + 1);
    }
    this.view.draw();
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
