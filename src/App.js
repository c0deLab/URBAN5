import React from 'react';
import UserSession from './ui/components/UserSession';
import Demo from './Demo';
import ControlPad from './helpers/ControlPad';
import './App.css';

/* global document */
/* global window */

// When not in kiosk mode:
// isKioskMode: show mouse on screen, enable hot keys
// timeout: time before resetting app to demo video (timeout in minutes)
const { isKioskMode, timeout } = window.URBAN5_flags;

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
      if (!isKioskMode) { // Only allow esc key in test mode
        this.goToDemo();
      }
    } else {
      this.leaveDemo();
    }
  }

  goToDemo = () => this.setState({ isDemo: true })

  leaveDemo = () => {
    const { isDemo } = this.state;
    if (isDemo) { // update state if in demo mode
      this.setState({ isDemo: false });
    }
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    this.resetTimer = setTimeout(this.goToDemo, 60000 * timeout);
  }

  render() {
    const { isDemo } = this.state;

    if (isKioskMode) { // in exhibition, hide cursor
      document.body.classList.add('hide-cursor');
    }

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
