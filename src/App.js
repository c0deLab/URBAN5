import React from 'react';
import UserSession from './components/UserSession';
import ControlPad from './helpers/ControlPad';
import './App.css';

/* global document */

const timeout = 60000 * 10; // 10 minutes

function renderDemo() {
  return (
    <div style={{ textAlign: 'center' }}>
      <video src="./imgs/startdemo.mp4" autoPlay muted loop style={{ width: '100%' }} />
    </div>
  );
}

// When no interaction has happened with the system for the duration of the timeout, go to demo
// When there is any interaction in demo mode, clear
export default class App extends React.Component {
  state = {
    isDemo: true,
  }

  componentDidMount() {
    // Reset the demo countdown on any user action
    document.addEventListener('keydown', event => this.handleKeyDown(event));
    document.addEventListener('mousedown', () => this.setDemoTimer());
    this.controlPad = new ControlPad(() => this.setDemoTimer());
  }

  componentWillUnmount() {
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }

    document.removeEventListener('keydown', event => this.handleKeyDown(event));
    document.removeEventListener('mousedown', () => this.setDemoTimer());
    this.controlPad.remove();
  }

  setDemoTimer() {
    this.setState({ isDemo: false });
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    this.resetTimer = setTimeout(this.goToDemo, timeout);
  }

  goToDemo = () => this.setState({ isDemo: true })

  handleKeyDown = event => {
    if (event.keyCode === 27) { // esc
      this.setState({ isDemo: true });
    } else {
      this.setDemoTimer();
    }
  }

  render() {
    const { isDemo } = this.state;
    return (
      <div className="app">
        {
          isDemo
            ? renderDemo()
            : <UserSession onRestart={() => this.setState({ isDemo: true })} />
        }
      </div>
    );
  }
}
