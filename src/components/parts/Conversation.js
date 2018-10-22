import React from 'react';

export default class Conversation extends React.Component {

  render() {
    var welcome = 'Welcome';
    if (this.props.user) {
      welcome = 'Welcome ' + (!this.props.user.isNewUser ? 'back ' : '') + this.props.user.name + ', this is URBAN5.'
    }
    return (
      <div>
        <span className="mono-text">{welcome}</span>
      </div>
    );
  }
}