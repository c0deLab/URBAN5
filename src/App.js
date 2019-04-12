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
  stroke: 3.5
};
window.SETTINGS = SETTINGS;

const session = new U5SessionFactory().last();
console.log('loaded session: ', session);
const cameraView = {
  camera: 0,
  slices: {
    x: 0,
    y: 0,
    z: 6
  }
};
// const session = new U5SessionFactory().test();

export default class App extends React.Component {

  state = {
    debug: true
  }

  componentDidMount() {
    document.addEventListener('keydown', (event) => {
      const { debug } = this.state;
      if (event.key === 'p') {
        this.setState({ debug: !debug });
      }
    });
  }

  render() {
    const { debug } = this.state;
    return (
      <div className="app">
        <MainPage session={session} cameraView={cameraView} />
        { debug && (
          <div>
            <DebuggingConstraints session={session} />
            <Debugging3D session={session} cameraView={cameraView} />
          </div>
        )}
      </div>
    );
  }
}
