import React, { Component } from 'react';
import MainPage from './components/MainPage';
import ActionsAPI from './js/ActionsAPI';
import Monitor from './js/Monitor';
import DesignModel from './js/DesignModel';
import './App.css';

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
