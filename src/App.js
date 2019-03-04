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
    console.log('render app');
    const { debug } = this.state;
    return (
      <div className="app">
        <MainPage session={session} />
        { debug && (
          <div>
            <DebuggingConstraints session={session} />
            <Debugging3D session={session} />
          </div>
        )}
      </div>
    );
  }
}
