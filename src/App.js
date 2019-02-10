import React, { Component } from 'react';
import MainPage from './components/MainPage';
import ActionsAPI from './js/ActionsAPI';
import Monitor from './js/Monitor';
import DesignModel from './js/DesignModel';
import * as THREE from 'three';
import './App.css';

/* global window */

window.SETTINGS = {
  w: 852,
  h: 852,
  color: '#E8E8DA',
  gridSize: 17,
  xMax: 17,
  yMax: 17,
  zMax: 7,
  r: 50,
  material: new THREE.LineBasicMaterial({ color: 0xE8E8DA })
};

const actionsAPI = new ActionsAPI();
const designModel = new DesignModel();
const monitor = new Monitor(actionsAPI, designModel);

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <MainPage actionsAPI={actionsAPI} monitor={monitor} designModel={designModel} />
      </div>
    );
  }
}
