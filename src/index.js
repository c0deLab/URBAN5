import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as THREE from 'three';
import Demo from './Demo';

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
  userName: 'Ted'
};
window.SETTINGS = SETTINGS;

// window.addEventListener('gamepadconnected', () => {
//   // if there is a gamepad, we assume it also has a touchscreen monitor and so we remove cursor
//   document.body.classList.add('touch');
// });

ReactDOM.render(<Demo />, document.getElementById('root'));
