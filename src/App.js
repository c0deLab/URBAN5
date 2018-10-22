import React, { Component } from 'react';
import MainPage from './components/routes/MainPage';
import './App.css';

export default class App extends Component {
  state = {
    user: {
      isNewUser: false,
      name: 'Erik',
    },
  };

  render() {
    return (
      <div className="app">
        <MainPage user={this.state.user} />
      </div>
    );
  }
}
