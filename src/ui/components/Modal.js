import React from 'react';
import PropTypes from 'prop-types';
import ControlPad from '../../helpers/ControlPad';

/* global document */

// Component that displays some content and fires onDismiss on any action (to remove itself)
// Used for the help overlays
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
      <div style={{ paddingTop: '20px' }}>
        { children }
      </div>
    );
  }
}
