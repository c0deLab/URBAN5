import React from 'react';
import './App.css';
import * as THREE from 'three';

import MainPage from './components/MainPage';
import DebuggingConstraints from './debugging/DebuggingConstraints';
import Debugging3D from './debugging/Debugging3D';
import U5SessionFactory from './js/sessionAPI/U5SessionFactory';

/* global window */

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
  clippingMax: 1
};
window.SETTINGS = SETTINGS;

const session = new U5SessionFactory().last();
console.log('loaded session: ', session);
const cameraView = {
  camera: 0,
  slices: {
    x: 0,
    y: 0,
    z: 0
  }
};
// const session = new U5SessionFactory().test();

// set view to first plane with object
const objects = session.design.getObjects();
if (objects) {
  let minY = SETTINGS.yMax;
  objects.forEach(object => {
    if (object.position.y < minY) {
      minY = object.position.y;
    }
  });
  cameraView.slices.y = minY;
}

export default class App extends React.Component {

  state = {
    view: 4
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
        default:
          break;
      }
    });
  }

  renderBody = view => {
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
    const { view } = this.state;
    return (
      <div className="app">
        { this.renderBody(view) }
      </div>
    );
  }
}
