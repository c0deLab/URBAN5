import React from 'react';
import PropTypes from 'prop-types';

import TopoView from '../js/TopoView';
import { getGridPointInModelSpace } from '../../helpers/Helpers';
import ActionsEnum from '../../api/enums/ActionsEnum';

/* global document */
/* global SETTINGS */

// Component that renders the Topo page
export default class TopoPage extends React.Component {
  static propTypes = {
    session: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    action: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  componentDidMount() {
    this.isWired = false;

    this.canvas = document.getElementById('display');
    this.canvas.addEventListener('mousedown', this.handleClick);

    // If the model had already been created, immediately wire
    this.wire();
  }

  componentDidUpdate(prevProps) {
    const { action, session } = this.props;
    const { action: prevAction } = prevProps;
    if (action !== prevAction) {
      // Add instructions on switch action
      switch (action) {
        case ActionsEnum.INCREASE_HEIGHT:
          session.monitor.setMessages(['Click the grid to increase elevation in the topography.']);
          break;
        case ActionsEnum.DECREASE_HEIGHT:
          session.monitor.setMessages(['Click the grid to decrease elevation in the topography.']);
          break;
        default:
          session.monitor.setMessages([]);
          break;
      }
    }
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

    this.view = new TopoView(this.canvas, session);
    // Trigger initial render
    this.view.draw();
  }

  handleClick = event => {
    const { session, action } = this.props;
    const point = getGridPointInModelSpace(event.offsetX, event.offsetY);
    if (!point) {
      return;
    }

    if (action === ActionsEnum.DECREASE_HEIGHT) {
      session.topo.decrease(point);
    } else {
      session.topo.increase(point);
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
