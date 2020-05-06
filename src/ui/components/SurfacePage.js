import React from 'react';
import PropTypes from 'prop-types';

import Display2DView from '../js/Display2DView';
import Display2DController from '../js/Display2DController';
import { getClosestEdgeInModelSpace } from '../../helpers/Helpers';
import ActionsEnum from '../../api/enums/ActionsEnum';

/* global document */
/* global SETTINGS */

// Component that renders the Surface page
export default class SurfacePage extends React.Component {
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

    this.canvas = document.getElementById('surface');
    if (SETTINGS.enableHotKeys) {
      document.addEventListener('keydown', this.handleKeyDown);
    }
    this.canvas.addEventListener('click', this.handleClick);

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
        case ActionsEnum.SOLID_SURFACE:
          session.monitor.setMessages(['Click to add surfaces on cubes to close off access.']);
          break;
        case ActionsEnum.NO_SURFACE:
          session.monitor.setMessages(['Click to remove surfaces on cubes to add access.']);
          break;
        default:
          break;
      }
    }

    // When the model is created, we need to wire it
    this.wire();
  }

  componentWillUnmount() {
    if (SETTINGS.enableHotKeys) {
      document.removeEventListener('keydown', this.handleKeyDown);
    }
    this.canvas.removeEventListener('click', this.handleClick);
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

    const edge = getClosestEdgeInModelSpace(event.offsetX, event.offsetY);
    if (!edge) {
      return;
    }

    const { x, y, side } = edge;
    controller.doAction(action, x, y, side);
  }

  render() {
    const { w, h } = SETTINGS;
    return (
      <div>
        <canvas id="surface" width={w} height={h} />
      </div>
    );
  }
}
