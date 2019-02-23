import React from 'react';
import './App.css';
import * as THREE from 'three';

import MainPage from './components/MainPage';
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

const session = new U5SessionFactory().newSession();
// const session = new U5SessionFactory().test();

export default function App() {
  return (
    <div className="app">
      <MainPage session={session} />
    </div>
  );
}
