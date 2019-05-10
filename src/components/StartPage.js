import React from 'react';

import U5SessionFactory from '../js/sessionAPI/U5SessionFactory';
import LoadPage from './LoadPage';
import TextInput from './TextInput';

/* global SETTINGS */
/* global document */

/** Class for the rendering the main view with top, menu, and center panels */
export default class StartPage extends React.Component {

  state = {
    stageId: -1,
    firstTime: null
  };

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyStartSession);
    document.removeEventListener('keydown', this.next);
  }

  handleKeyStartSession = e => {
    e.preventDefault();
    this.newSession();
  }

  onFirstTimeSpeak = text => {
    if (text.toLowerCase().includes('y')) {
      this.setState({ stageId: 1, firstTime: true });
    } else {
      this.setState({ stageId: 1, firstTime: false });
    }
  };

  onNameSpeak = text => {
    const { firstTime } = this.state;
    SETTINGS.userName = text ? text : 'User';
    if (firstTime) {
      this.setState({ stageId: 3 });
    } else {
      this.setState({ stageId: 2 });
    }
  };

  newSession = () => {
    const { onSelectSession } = this.props;
    const session = new U5SessionFactory().newSession();
    onSelectSession(session);
  }

  next = e => {
    e.preventDefault();
    const { stageId } = this.state;
    this.setState({ stageId: stageId + 1 });
    document.removeEventListener('keydown', this.next);
  }

  getStage = () => {
    const { stageId } = this.state;
    const { onSelectSession } = this.props;
    switch (stageId) {
      case -1:
        document.addEventListener('keydown', this.next);
        return (
          <div>
            <h1>URBAN5</h1>
            <div>Welcome to a recreation of Nicholas Negroponte's URBAN5.</div>
            <br />
            <div>URBAN5 is an urban planning tool representing the built environment as ten foot cubes.</div>
            <br />
            <div>The purpose of this project is not an exact replica of the original with the same hardware and software, but rather an approximation using modern tools to enrich our understanding of the device. URBAN5 was created with the goal to “study the desirability and feasibility of conversing with a machine about an environmental design project.”</div>
            <br />
            <br />
            <button type="button" onClick={this.next}>&gt; CONTINUE</button>
            <br />
            <br />
            <div style={{ textAlign: 'center', margin: '40px' }}>
              <img src="/imgs/zoomscrn.png" alt="original" />
            </div>
          </div>
        );
      case 0:
        return (
          <div>
            <div>Is this the first time you are using the machine? (Y/N)</div>
            <input type="text" id="speak" autoComplete="off" spellCheck="false" value="" onChange={e => this.onFirstTimeSpeak(e.target.value)} autoFocus />
          </div>
        );
      case 1:
        return (
          <div>
            <div>What is your name?</div>
            <TextInput onSubmit={this.onNameSpeak} />
          </div>
        );
      case 2:
        return (
          <div>
            <LoadPage onSelectSession={onSelectSession} />
          </div>
        );
      case 3:
        // new session on any key, setTimeout so it gets add after key down event triggering this
        setTimeout(() => document.addEventListener('keydown', this.handleKeyStartSession), 0);
        return (
          <div>
            <div>
              Welcome&nbsp;
              <span>{ SETTINGS.userName }!</span>
            </div>
            <br />
            <br />
            <div>To save and exit at any time, press Escape.</div>
            {/*<div>Draw mode permits you to manipulate elements within a given two dimensional plane at any scale. You have already described the volume of your site, this rectangular chunk can be sectioned vertically or horizontally. The "slice" itself can be moved in or out("stepin or stepout") or rotated ninety degrees("lookleft" or "lookright"), to start, the machine assumes a vertical slice looking through the center of your site, looking north.</div>*/}
            <br />
            <br />
            <button type="button" onClick={this.newSession}>&gt; CONTINUE</button>
          </div>
        );
      default:
        break;
    }
    return null;
  }

  render() {
    return (
      <div>
        <div style={{ width: '1024px', height: '100%', float: 'left' }}>
          <div style={{ padding: '80px' }}>
            { this.getStage() }
          </div>
        </div>
      </div>
    );
  }
}
