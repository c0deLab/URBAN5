import React from 'react';
import UserSession from './ui/components/UserSession';
import Demo from './ui/components/Demo';
import ControlPad from './helpers/ControlPad';
import './App.css';

/* global document */

const timeout = 60000 * 10; // 10 minutes

// When no interaction has happened with the system for the duration of the timeout, go to demo
// When there is any interaction in demo mode, clear
export default class App extends React.Component {
  state = {
    isDemo: true,
  }

  componentDidMount() {
    // Reset the demo countdown on any user action
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('mousedown', this.leaveDemo);
    this.controlPad = new ControlPad(this.leaveDemo);
  }

  componentWillUnmount() {
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }

    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('mousedown', this.leaveDemo);
    this.controlPad.remove();
  }

  handleKeyDown = event => {
    if (event.keyCode === 27) { // esc
      this.goToDemo();
    } else {
      this.leaveDemo();
    }
  }

  goToDemo = () => this.setState({ isDemo: true })

  leaveDemo = () => {
    this.setState({ isDemo: false });
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    this.resetTimer = setTimeout(this.goToDemo, timeout);
  }

  render() {
    const { isDemo } = this.state;
    return (
      <div className="app">
        {
          isDemo
            ? <Demo />
            : <UserSession onRestart={() => this.goToDemo()} />
        }
      </div>
    );
  }
}
