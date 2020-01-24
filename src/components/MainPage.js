import React from 'react';
import PropTypes from 'prop-types';

import Menu from './Menu';
import Top from './Top';
import ActionsEnum from '../js/enums/ActionsEnum';

import Draw from './Draw';
import Topo from './Topo';
import Surface from './Surface';

import DisplayWalkthrough from './DisplayWalkthrough';

/* global document */
/* global window */
/* global location */

/** Class for the rendering the main view with top, menu, and center panels */
export default class MainPage extends React.Component {
  static propTypes = {
    session: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    // action: ActionsEnum.ADDCUBE, // Default action is ADDCUBE
    // displayType: 'CALC'

    action: ActionsEnum.ADDCUBE, // Default action is ADDCUBE
    displayType: 'DRAW',

    // action: ActionsEnum.INCREASE_HEIGHT, // Default action is ADDCUBE
    // displayType: 'TOPO'

    // action: ActionsEnum.NO_SURFACE, // Default action is ADDCUBE
    // displayType: 'SURF'

  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('gamepadconnected', this.addControlPad);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('gamepadconnected', this.addControlPad);
    if (this.controlPadTimeout) {
      clearTimeout(this.controlPadTimeout);
    }
  }

  onMenuClick = action => {
    this.setState({ action });
  }

  /** Add some hotkeys to make testing easier */
  handleKeyDown = event => {
    const { action } = this.state;
    if (action === ActionsEnum.SPEAK_CONSTRAINT) {
      // do nothing
    } else {
      console.log(event.keyCode);
      switch (event.keyCode) {
        // Switch between views
        case 49: // 1
          this.setState({
            displayType: 'DRAW',
            action: ActionsEnum.ADDCUBE
          });
          break;
        case 50: // 2
          this.setState({
            displayType: 'SURF',
            action: ActionsEnum.NO_SURFACE
          });
          break;
        case 51: // 3
          this.setState({
            displayType: 'TOPO',
            action: ActionsEnum.INCREASE_HEIGHT
          });
          break;
        case 52: // 3
          this.setState({
            displayType: 'CALC'
          });
          break;
        // case 191: // /
        //   session.monitor.clearConstraints();
        //   break;
        // case 220: // \
        //   session.clear();
        //   location.reload(); // eslint-disable-line
        //   break;
        default:
          break;
      }
    }
  }

  addControlPad = event => {
    this.controlPad = event.gamepad;
    this.controlPadButtonPressMap = {};
    const inputLoop = () => {
      if (this.controlPad && this.controlPad.buttons) {
        for (let i = 0; i < this.controlPad.buttons.length; i += 1) {
          const isPressed = this.controlPad.buttons[i].pressed;
          if (isPressed && !this.controlPadButtonPressMap[i]) {
            // button down (fires once per press)
            this.handleControlPadButtonPress(i);
          }
          this.controlPadButtonPressMap[i] = isPressed;
        }
      }

      this.controlPadTimeout = setTimeout(inputLoop, 20);
    };
    inputLoop();
  }

  handleControlPadButtonPress = i => {
    console.log(i + ' is pressed');
    switch (i) {
      // Switch between views
      case 0:
        this.setState({
          displayType: 'DRAW',
          action: ActionsEnum.ADDCUBE
        });
        break;
      case 2:
        this.setState({
          displayType: 'SURF',
          action: ActionsEnum.NO_SURFACE
        });
        break;
      case 3:
        this.setState({
          displayType: 'TOPO',
          action: ActionsEnum.INCREASE_HEIGHT
        });
        break;
      case 5:
        this.setState({
          displayType: 'CALC'
        });
        break;
      case 9:
        this.setState({
          displayType: 'DRAW',
          action: ActionsEnum.SPEAK_CONSTRAINT
        });
        break;
      default:
        break;
    }
  }

  getDisplay = () => {
    const { action, displayType } = this.state;
    const { session, cameraView } = this.props;

    if (!session || !action) {
      return null;
    }

    switch (displayType) {
      case 'DRAW':
        return (<Draw action={action} session={session} cameraView={cameraView} />);
      case 'CALC':
        return (<DisplayWalkthrough session={session} />);
      case 'TOPO':
        return (<Topo action={action} session={session} />);
      case 'SURF':
        return (<Surface action={action} session={session} cameraView={cameraView} />);
      default:
        break;
    }

    return null;
  }

  getActions = () => {
    const { displayType } = this.state;

    switch (displayType) {
      case 'DRAW':
        return [
          ActionsEnum.STEPOUT,
          ActionsEnum.STEPIN,
          ActionsEnum.ROTATELT,
          ActionsEnum.ROTATERT,
          ActionsEnum.ADDCUBE,
          ActionsEnum.ADDTREE,
          ActionsEnum.ADDROOF,
          ActionsEnum.REMOVE,
          ActionsEnum.SPEAK_CONSTRAINT
        ];
      case 'CALC':
        return [];
      case 'TOPO':
        return [
          ActionsEnum.INCREASE_HEIGHT,
          ActionsEnum.DECREASE_HEIGHT
        ];
      case 'SURF':
        return [
          ActionsEnum.SOLID_SURFACE,
          ActionsEnum.NO_SURFACE,
          // ActionsEnum.PARTITION_SURFACE,
          // ActionsEnum.TRANSPARENT_SURFACE,
          // ActionsEnum.HAS_ACCESS,
          // ActionsEnum.NO_ACCESS
        ];
      default:
        break;
    }

    return [];
  }

  render() {
    const { action } = this.state;
    const actions = this.getActions();

    const { session } = this.props;
    return (
      <div>
        <div style={{ width: '864px', height: '100%', float: 'left' }}>
          <div style={{ width: '864px', height: '160px' }}>
            <div style={{ padding: '20px' }}>
              <Top session={session} action={action} />
            </div>
          </div>
          <div style={{ width: '852px', height: '852px', padding: '5px' }}>
            {this.getDisplay()}
          </div>
        </div>
        <div style={{ width: '160px', height: '100%', float: 'left' }}>
          <div style={{ padding: '20px' }}>
            <Menu actions={actions} onClick={this.onMenuClick} action={action} />
          </div>
        </div>
      </div>
    );
  }
}
