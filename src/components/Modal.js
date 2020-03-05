import React from 'react';
import PropTypes from 'prop-types';
import ControlPad from '../js/helpers/ControlPad';

/* global document */

// Display some content and fire onDismiss on any action (to probably remove)
export default class Modal extends React.Component {
  static propTypes = {
    onDismiss: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
  }

  componentDidMount() {
    // Dismiss on any action
    const { onDismiss } = this.props;
    // Need timeout to prevent click that triggers open from triggering these
    setTimeout(() => {
      document.addEventListener('keydown', onDismiss);
      document.addEventListener('mousedown', onDismiss);
      this.controlPad = new ControlPad(onDismiss);
    }, 0);
  }

  componentWillUnmount() {
    const { onDismiss } = this.props;
    document.removeEventListener('keydown', onDismiss);
    document.removeEventListener('mousedown', onDismiss);
    this.controlPad.remove();
  }

  render() {
    const { children } = this.props;
    return (
      <div style={{ width: '1024px', height: '100%', float: 'left', padding: '20px' }}>
        { children }
      </div>
    );
  }
}
