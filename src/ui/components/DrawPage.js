import React from 'react';
import PropTypes from 'prop-types';

import Display2DView from '../js/Display2DView';
import Display2DController from '../js/Display2DController';
import ActionsEnum from '../../api/enums/ActionsEnum';
import { getGridPointInModelSpace } from '../../helpers/Helpers';

/* global document */
/* global SETTINGS */

// Component for the Draw page
export default class DrawPage extends React.Component {
  static propTypes = {
    action: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    session: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    cameraView: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    registerActionListener: PropTypes.func.isRequired, // eslint-disable-line react/forbid-prop-types
    unregisterActionListener: PropTypes.func.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    controller: null
  }

  componentDidMount() {
    this.isWired = false;

    this.canvas = document.getElementById('draw');
    this.canvas.addEventListener('mousedown', this.handleClick);

    const { registerActionListener } = this.props;
    registerActionListener(this.onSelectAction);

    // If the model had already been created, immediately wire
    this.wire();
  }

  componentDidUpdate(prevProps) {
    const { action, session } = this.props;
    const { action: prevAction } = prevProps;
    if (action !== prevAction) {
      // Add instructions on switch action
      switch (action) {
        case ActionsEnum.ADDCUBE:
          session.monitor.setMessages(['Click to add a cube.']);
          break;
        case ActionsEnum.ADDTREE:
          session.monitor.setMessages(['Click to add a tree.']);
          break;
        case ActionsEnum.ADDROOF:
          session.monitor.setMessages(['Click to add a roof.']);
          break;
        case ActionsEnum.REMOVE:
          session.monitor.setMessages(['Click to remove an object.']);
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
    const { unregisterActionListener } = this.props;
    unregisterActionListener(this.onSelectAction);
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

  onSelectAction = action => {
    const { controller } = this.state;
    switch (action) {
      case ActionsEnum.STEPIN:
        controller.nextSlice();
        break;
      case ActionsEnum.STEPOUT:
        controller.previousSlice();
        break;
      case ActionsEnum.ROTATELT:
        controller.rotateLeft();
        break;
      case ActionsEnum.ROTATERT:
        controller.rotateRight();
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
        <canvas id="draw" width={w} height={h} />
      </div>
    );
  }
}
