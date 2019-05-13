import React from 'react';
import PropTypes from 'prop-types';
import ActionsEnum from '../js/enums/ActionsEnum';
import TextInput from './TextInput';

/* global window */
/* global document */

/** Class for the top of the screen where text interaction with URBAN5 takes place */
export default class Top extends React.PureComponent {
  static propTypes = {
    session: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    action: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    textMessages: []
  };

  componentDidMount() {
    const { session } = this.props;

    const poll = () => {
      const textMessages = session.monitor.getMessages();
      this.setState({ textMessages });
      this.pollTimeout = setTimeout(poll, 100);
    };
    poll();
  }

  componentWillUnmount() {
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout);
    }
  }

  onMessage = newMessage => {
    this.setState(prevState => ({ textMessages: [...prevState.textMessages, newMessage] }));
  }

  componentDidUpdate = () => {
    this.scrollElement();
  }

  scrollElement = () => {
    window.requestAnimationFrame(() => {
      const container = document.getElementById('topContainer');
      if (container !== undefined) {
        container.scrollTop = container.scrollHeight + 100;
      }
    });
  };

  onSpeak = text => {
    const { session } = this.props;
    session.monitor.addConstraint(text);
    const textMessages = session.monitor.getMessages();
    this.setState({ textMessages: textMessages.slice() });
  };

  render() {
    const { action } = this.props;
    const { textMessages } = this.state;

    let textInput = null;

    if (action === ActionsEnum.SPEAK_CONSTRAINT) {
      textInput = (
        <div>
          <TextInput onSubmit={this.onSpeak} />
        </div>
      );
    }

    console.log('textMessages', textMessages);
    const messageElements = textMessages.map(message => (
      <div className="mono-text" key={message}>{message}</div>
    ));

    return (
      <div id="topContainer" style={{ overflow: 'hidden', height: '75px' }}>
        { messageElements }
        { textInput }
      </div>
    );
  }
}
