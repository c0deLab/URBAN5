import React from 'react';
import PropTypes from 'prop-types';

export default class Conversation extends React.PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired
  }

  render() {
    const { user } = this.props;

    let welcome = 'Welcome';

    if (user) {
      welcome = `Welcome ${!user.isNewUser ? 'back ' : ''} ${user.name} this is URBAN5.`;
    }
    return (
      <div>
        <span className="mono-text">{welcome}</span>
      </div>
    );
  }
}
