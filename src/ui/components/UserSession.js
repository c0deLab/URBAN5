import React from 'react';
import Main from './Main';
import TextInput from './TextInput';
import Modal from './Modal';

/* global window */

// Front door for new user session
export default class UserSession extends React.Component {
  state = {
    hasUserName: false,
    hasFinishedInstructions: false
  }

  setUserName(userName) {
    window.SETTINGS.userName = userName || 'User';
    this.setState({ hasUserName: true });
  }

  renderAskUserName() {
    return (
      <div style={{ padding: '20px' }}>
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
          <video src="./imgs/startdemo.mp4" autoPlay muted loop style={{ height: '740px' }} />
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
      body = <Main onRestart={onRestart} />;
    }

    return body;
  }
}
