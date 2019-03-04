import React from 'react';
import PropTypes from 'prop-types';

/** Class that renders various views helpful for debugging. */
export default class DebuggingConstraints extends React.Component {
  static propTypes = {
    session: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    constraints: [],
    systemConstraints: [],
    buildings: []
  };

  componentDidMount() {
    const poll = () => {
      const { session } = this.props;
      const constraints = session._monitor.constraints.slice();
      const systemConstraints = session._monitor.systemConstraints.slice();

      const buildings = session._design._buildings;

      this.setState({ constraints, systemConstraints, buildings });
      setTimeout(poll, 500);
    };
    poll();
  }

  render() {
    const { constraints, systemConstraints, buildings } = this.state;
    return (
      <div style={{ position: 'absolute', left: '10px', top: '10px', color: '#000', width: '500px', wordWrap: 'break-word', fontSize: '16px' }}>
        <div>
          <h3>User Constraints:</h3>
          <div>{ constraints.map(c => (<div>{ JSON.stringify(c) }</div>)) }</div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h3>System Constraints:</h3>
          <div>{ systemConstraints.map(c => (<div>{ JSON.stringify(c) }</div>)) }</div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h3>Buildings:</h3>
          <div>{ JSON.stringify(buildings) }</div>
        </div>
      </div>
    );
  }
}
