import React from 'react';
import PropTypes from 'prop-types';

/** Class for the top of the screen where text interaction with URBAN5 takes place */
export default class Top extends React.PureComponent {
  static propTypes = {
    // An object representing the user data that the system interacts with and updates
    user: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
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
