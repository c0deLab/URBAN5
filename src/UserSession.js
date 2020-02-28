import React from 'react';
import App from './App';
import TextInput from './components/TextInput';
import Modal from './components/Modal';

/* global window */

// Front door for new user session
export default class UserSession extends React.Component {
  state = {
    hasUserName: false,
    hasFinishedInstructions: false
  }

  setUserName(userName) {
    window.SETTINGS.userName = userName;
    this.setState({ hasUserName: true });
  }

  renderAskUserName() {
    return (
      <div style={{ width: '1024px', height: '100%', float: 'left', padding: '80px' }}>
        <div>What is your name?</div>
        <TextInput onSubmit={userName => this.setUserName(userName)} />
      </div>
    );
  }

  renderInstructions() {
    return (
      <Modal onDismiss={() => this.setState({ hasFinishedInstructions: true })}>
        <div>{ `Welcome ${window.SETTINGS.userName}! Use URBAN5 to:` }</div>
        <br />
        <ul>
          <li>define a topography</li>
          <li>create design constraints</li>
          <li>add objects</li>
          <li>edit surfaces</li>
          <li>calculate circulation</li>
        </ul>
        <br />
        <div style={{ textAlign: 'center' }}>
          <img src="./imgs/long.gif" alt="Usage Demo" style={{ width: '60%' }} />
        </div>
      </Modal>
    );
  }

  render() {
    const { hasUserName, hasFinishedInstructions } = this.state;
    const { onRestart } = this.props;

    let body;
    if (!hasUserName) {
      body = this.renderAskUserName();
    } else if (!hasFinishedInstructions) {
      body = this.renderInstructions();
    } else {
      body = <App onRestart={onRestart} />;
    }

    return (
      <div className="app">
        { body }
      </div>
    );
  }
}
