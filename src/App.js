import React from 'react';
import './App.css';
import * as THREE from 'three';

import StartPage from './components/StartPage';
import MainPage from './components/MainPage';
import DebuggingConstraints from './debugging/DebuggingConstraints';
import Debugging3D from './debugging/Debugging3D';
import U5SessionFactory from './js/data/U5SessionFactory';

/* global window */
/* global document */

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
  userName: null
};
window.SETTINGS = SETTINGS;


export default class App extends React.Component {

  state = {
    view: 4,
    session: null,
    cameraView: null,
    restartIndex: 0,
  }

  componentDidMount() {
    document.addEventListener('keydown', event => {
      console.log('event.key', event.key);
      switch (event.key) {
        case 'F1':
          this.setState({ view: 1 });
          break;
        case 'F2':
          this.setState({ view: 2 });
          break;
        case 'F3':
          this.setState({ view: 3 });
          break;
        case 'F4':
          this.setState({ view: 4 });
          break;
        case 'Escape':
          this.reset();
          break;
        default:
          break;
      }
    });

    // Add timer that checks for no activity, reset system after one minute
    document.addEventListener('keydown', () => {
      clearTimeout(this.resetTimer);
      this.resetTimer = setTimeout(this.reset, 60000);
    });
    document.addEventListener('mousedown', () => {
      clearTimeout(this.resetTimer);
      this.resetTimer = setTimeout(this.reset, 60000);
    });
    this.resetTimer = setTimeout(this.reset, 60000);

    // For testing purposes, load the last saved session at app load
    this.startSession(new U5SessionFactory().last());
  }

  startSession = session => {
    const cameraView = this.getCameraView(session);
    this.setState({ session, cameraView });
  }

  // Get a fresh camera view for the session
  // The view moves its x and y cameras to be on the first object it encounters in the design, or 0 if no objects
  getCameraView = session => {
    const cameraView = {
      camera: 0,
      slices: {
        x: 0,
        y: 0,
        z: 0
      }
    };

    // set view to first plane with object
    const objects = session.design.getObjects();
    if (objects.length > 0) {
      let minY = SETTINGS.yMax;
      let minX = SETTINGS.xMax;
      objects.forEach(object => {
        if (object.position.y < minY) {
          minY = object.position.y;
        }
        if (object.position.x < minX) {
          minX = object.position.x;
        }
      });
      cameraView.slices.y = minY;
      cameraView.slices.x = minX;
    }
    return cameraView;
  }

  // Reset the system to the start of the start menu
  reset = () => {
    const { restartIndex } = this.state;
    SETTINGS.userName = null;
    this.setState({ session: null, cameraView: null, restartIndex: restartIndex + 1 });
  }

  renderBody = view => {
    const { session, cameraView } = this.state;

    switch (view) {
      case 1:
        return (<MainPage session={session} cameraView={cameraView} />);
      case 2:
        return (
          <div style={{ width: '100%' }}>
            <Debugging3D session={session} cameraView={cameraView} size={962} />
          </div>
        );
      case 3:
        return (<DebuggingConstraints session={session} />);
      case 4:
        // Render all 3
        return (
          <div>
            <MainPage session={session} cameraView={cameraView} />
            <div style={{ position: 'absolute', right: '20px', top: '20px', color: '#000', border: '1px solid #E8E8DA', width: '500px' }}>
              <Debugging3D session={session} cameraView={cameraView} size={500} />
            </div>
            <div style={{ position: 'absolute', left: '20px', top: '20px', width: '500px', wordWrap: 'break-word', border: '1px solid #E8E8DA', padding: '10px 10px 40px 10px', fontSize: '16px' }}>
              <DebuggingConstraints session={session} />
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  render() {
    const { view, session, restartIndex } = this.state;
    return (
      <div className="app">
        { session === null ? (<StartPage key={restartIndex} onSelectSession={this.startSession} />) : this.renderBody(view) }
      </div>
    );
  }
}
