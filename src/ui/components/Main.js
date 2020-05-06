import React from 'react';
import * as THREE from 'three';

import StartPage from './StartPage';
import SessionPageContainer from './SessionPageContainer';
import HelpPage from '../../HelpPage';
import DebuggingConstraints from './debugging/DebuggingConstraints';
import Debugging3D from './debugging/Debugging3D';
import ActionsEnum, { getActions } from '../../api/enums/ActionsEnum';
import ControlPad from '../../helpers/ControlPad';
import U5SessionFactory from '../../api/U5SessionFactory';
import controlPadMapping from '../../controlPadMapping';

/* global window */
/* global document */

const { isKioskMode } = window.URBAN5_flags;

// Create a global settings object for shared settings across the project
const SETTINGS = {
  w: 852,
  h: 852,
  color: '#E8E8DA',
  gridSize: 17,
  xMax: 17,
  yMax: 17,
  zMax: 7,
  r: 50,
  material: new THREE.LineBasicMaterial({ color: 0xE8E8DA }),
  stroke: 3.5,
  clippingMax: 1,
  userName: 'User',
  enableHotKeys: !isKioskMode
};
window.SETTINGS = SETTINGS;

const defaultMainPageSettings = {
  // action: ActionsEnum.ADDCUBE, // Default action is ADDCUBE
  // displayType: 'DRAW',
  action: ActionsEnum.INCREASE_HEIGHT, // Default action is ADDCUBE
  displayType: 'TOPO',
};

const defaultCameraView = () => (
  {
    camera: 0,
    slices: {
      x: 0,
      y: 8,
      z: 0
    }
  }
);

// Main component for the rendering a specific session
export default class Main extends React.Component {
  state = {
    debugView: 0,
    session: null,
    cameraView: defaultCameraView(),
    restartIndex: 0,
    isPanic: false,
    displayType: null,
    action: null,
    aboutToRestart: false
  }

  componentDidMount() {
    if (SETTINGS.enableHotKeys) {
      document.addEventListener('keydown', this.handleKeyDown);
    }
    this.controlPad = new ControlPad(i => this.handleControlPadButtonPress(i));
    this.startSession(new U5SessionFactory().newSession());
  }

  componentDidUpdate(prevProps, prevState) {
    const { displayType, session } = this.state;
    const { displayType: prevDisplayType } = prevState;
    if (displayType !== prevDisplayType) {
      // Add instructions for each page as message on switch
      switch (displayType) {
        case 'TOPO':
          session.monitor.setMessages(['Click the grid to increase elevation in the topography.']);
          break;
        case 'DRAW':
          session.monitor.setMessages(['Click to add a cube.']);
          break;
        case 'SURF':
          session.monitor.setMessages(['Click to remove surfaces on cubes to add access.']);
          break;
        case 'CALC':
          session.monitor.setMessages(['Select a start and end point for the path.']);
          break;
        default:
          break;
      }
    }
  }

  componentWillUnmount() {
    if (SETTINGS.enableHotKeys) {
      document.removeEventListener('keydown', this.handleKeyDown);
    }
    this.controlPad.remove();
  }

  // Hot keys for testing purposes
  handleKeyDown = event => {
    const { action, aboutToRestart, session } = this.state;
    if (aboutToRestart) {
      if (event.keyCode === 89 && aboutToRestart) { // if y
        this.restart();
      }
      // exit mode
      session.monitor.setMessages([]);
      this.setState({ aboutToRestart: false });
      return;
    }

    if (action === ActionsEnum.SPEAK_CONSTRAINT) {
      // do nothing, trying to type message
      return;
    }

    // Map keys 1-0 to actions for testing purposes
    if (event.keyCode >= 48 && event.keyCode <= 57) {
      if (event.keyCode >= 49 && event.keyCode <= 52) {
        this.handleActions(event.keyCode - 49); // top row
      } else if (event.keyCode >= 53 && event.keyCode <= 56) {
        this.handleActions(event.keyCode - 53 + 16); // bottom row
      } else if (event.keyCode === 57) {
        this.handleActions(4); // first num button
      } else if (event.keyCode === 48) {
        this.handleActions(5); // second num button
      }
      return;
    }

    switch (event.keyCode) {
      case 112: // F1
        this.setState({ debugView: 0 });
        break;
      case 113: // F2
        this.setState({ debugView: 1 });
        break;
      case 114: // F3
        this.setState({ debugView: 2 });
        break;
      case 115: // F4
        this.setState({ debugView: 3 });
        break;
      case 116: // F5
        document.body.classList.add('touch');
        break;
      // case 27: // ESC
      //   this.restart();
      //   break;
      // case 191: // /
      //   this.state.session.monitor.clearConstraints(); // eslint-disable-line
      //   break;
      // case 220: // \
      //   this.state.session.clear(); // eslint-disable-line
      //   location.reload(); // eslint-disable-line
      //   break;
      default:
        break;
    }
  }

  handleControlPadButtonPress = i => {
    console.log(`Control Pad: ${i} pressed`); // eslint-disable-line
    this.handleActions(controlPadMapping[i]);
  }

  startSession = session => {
    const cameraView = defaultCameraView();
    this.setState({ session, cameraView, ...defaultMainPageSettings });
  }

  // Reset the system for a new user
  restart = () => {
    const { restartIndex } = this.state;
    const { onRestart } = this.props;
    const newSession = new U5SessionFactory().newSession();
    this.setState({
      session: newSession,
      cameraView: defaultCameraView(),
      restartIndex: restartIndex + 1,
      isPanic: false,
      ...defaultMainPageSettings
    });
    onRestart();
  }

  // handles all the button actions possible for this app
  handleActions(i) {
    const { session, isPanic, displayType } = this.state;
    console.log(`Do action ${i}`); // eslint-disable-line

    if (i === 17) { // (procedural -> RESTA.)
      console.log('procedural -> RESTA.'); // eslint-disable-line
      // TODO: add a confirmation?
      session.monitor.setMessages(['Are you sure you want to restart (y)?']);
      this.setState({ aboutToRestart: true });
      return;
    }

    if (i === 19) { // (theraputic -> PANIC)
      console.log('theraputic -> PANIC'); // eslint-disable-line
      this.setState({
        isPanic: !isPanic
      });
      return;
    }
    this.setState({
      isPanic: false
    });

    if (!session) {
      // disable all other actions when no session
      return;
    }

    const actions = getActions(displayType);
    switch (i) {
      case 16: // (graphical -> START)
        console.log('graphical -> START'); // eslint-disable-line
        this.setState({
          displayType: 'START'
        });
        break;
      case 0: // (graphical -> TOPO)
        console.log('graphical -> TOPO'); // eslint-disable-line
        this.setState({
          displayType: 'TOPO',
          action: ActionsEnum.INCREASE_HEIGHT
        });
        break;
      case 1: // (graphical -> DRAW)
        console.log('graphical -> DRAW'); // eslint-disable-line
        this.setState({
          displayType: 'DRAW',
          action: ActionsEnum.ADDCUBE
        });
        break;
      case 2: // (graphical -> SURF)
        console.log('graphical -> SURF'); // eslint-disable-line
        this.setState({
          displayType: 'SURF',
          action: ActionsEnum.NO_SURFACE
        });
        break;
      case 3: // (operational -> circul.)
        console.log('operational -> circul.'); // eslint-disable-line
        this.setState({
          displayType: 'CALC'
        });
        break;
      case 4: // (symbolic -> 0)
        console.log('symbolic -> 0'); // eslint-disable-line
        if (actions && actions.length > 0) {
          document.querySelectorAll('#menu button')[0].click();
        }
        break;
      case 5: // (symbolic -> 1)
        console.log('symbolic -> 1'); // eslint-disable-line
        if (actions && actions.length > 1) {
          document.querySelectorAll('#menu button')[1].click();
        }
        break;
      case 6: // (symbolic -> 2)
        console.log('symbolic -> 2'); // eslint-disable-line
        if (actions && actions.length > 2) {
          document.querySelectorAll('#menu button')[2].click();
        }
        break;
      case 10: // (symbolic -> 10)
        console.log('symbolic -> 10'); // eslint-disable-line
        if (actions && actions.length > 4) {
          document.querySelectorAll('#menu button')[4].click();
        }
        break;
      case 11: // (symbolic -> 11)
        console.log('symbolic -> 11'); // eslint-disable-line
        if (actions && actions.length > 5) {
          document.querySelectorAll('#menu button')[5].click();
        }
        break;
      case 12: // (symbolic -> 12)
        console.log('symbolic -> 12'); // eslint-disable-line
        if (actions && actions.length > 6) {
          document.querySelectorAll('#menu button')[6].click();
        }
        break;
      case 18: // (procedural -> STORE)
        console.log('procedural -> STORE'); // eslint-disable-line
        session.save();
        session.monitor.setMessages(['Session saved.']);
        break;
      default:
        break;
    }
  }

  renderDebug = () => {
    const { session, cameraView, debugView } = this.state;
    switch (debugView) {
      case 1:
        // Render all 3
        return (
          <div>
            { this.renderSessionPage() }
            <div style={{ position: 'absolute', right: '20px', top: '20px', color: '#000', border: '1px solid #E8E8DA', width: '500px' }}>
              <Debugging3D key={`debug3d_${session._id}`} session={session} cameraView={cameraView} size={500} />
            </div>
            <div style={{ position: 'absolute', left: '20px', top: '20px', width: '500px', wordWrap: 'break-word', border: '1px solid #E8E8DA', padding: '10px 10px 40px 10px', fontSize: '16px' }}>
              <DebuggingConstraints key={`debug_con_${session._id}`} session={session} />
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ width: '100%' }}>
            <Debugging3D key={`debug3d_${session._id}`} session={session} cameraView={cameraView} size={962} />
          </div>
        );
      case 3:
        return (<DebuggingConstraints key={`debug_con_${session._id}`} session={session} />);
      default:
        return null;
    }
  }

  renderSessionPage = () => {
    const { session, action, displayType, cameraView } = this.state;
    return (
      <SessionPageContainer
        key={`session_${session._id}`}
        session={session}
        action={action}
        displayType={displayType}
        cameraView={cameraView}
        setAction={action => this.setState({ action })}
      />
    );
  }

  renderContent() {
    const { session, restartIndex, displayType, isPanic, debugView } = this.state;

    // first of all if isPanic, render panic page
    if (isPanic) {
      return <HelpPage displayType={displayType} />;
    }

    // render start page if no session
    if (session === null || displayType === 'START') {
      return <StartPage key={restartIndex} onSelectSession={this.startSession} />;
    }

    // if debug enabled, render
    if (debugView !== 0) {
      return this.renderDebug();
    }

    // render session
    return this.renderSessionPage();
  }

  render() {
    return this.renderContent();
  }
}
