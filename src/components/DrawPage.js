import React from 'react';
import PropTypes from 'prop-types';

import Display2DView from '../js/ui/Display2DView';
import Display2DController from '../js/ui/Display2DController';
import ActionsEnum from '../js/enums/ActionsEnum';
import { getGridPointInModelSpace } from '../js/helpers/Helpers';

/* global document */
/* global SETTINGS */

/** Class for the 2D slice views */
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
    document.addEventListener('keydown', this.handleKeyDown);
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
    document.removeEventListener('keydown', this.handleKeyDown);
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
        <canvas id="draw" width={w} height={h} />
      </div>
    );
  }
}
