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
    buildings: [],
    objects: []
  };

  componentDidMount() {
    const poll = () => {
      const { session } = this.props;
      const constraints = session._monitor.constraints.slice();
      const systemConstraints = session._monitor.systemConstraints.slice();

      const buildings = session._design._buildings;
      const objects = session._design.getObjects();

      this.setState({ constraints, systemConstraints, buildings, objects });
      this.pollTimeout = setTimeout(poll, 500);
    };
    poll();
  }

  componentWillUnmount() {
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout);
    }
  }

  getStringsFromConstraints = c => {
    let type;
    if (parseInt(c.type, 10) === 0) {
      type = 'room';
    } else if (parseInt(c.type, 10) === 1) {
      type = 'roof';
    } else {
      type = 'structure';
    }

    return `"${c.text}":\n${c.fn} ${c.prop} of ${type} ${c.comp} ${c.value} == ${c.result}\n\n`;
  }

  render() {
    const { constraints, systemConstraints, buildings } = this.state;

    return (
      <div>
        <div>
          <h3>User Constraints:</h3>
          <div>{ constraints.map(c => (<div key={c.text} style={{ whiteSpace: 'pre' }}>{ this.getStringsFromConstraints(c) }</div>)) }</div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h3>System Constraints:</h3>
          <div>{ systemConstraints.map(c => (<div key={c.text} style={{ whiteSpace: 'pre' }}>{ this.getStringsFromConstraints(c) }</div>)) }</div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h3>Buildings:</h3>
          <div>{ JSON.stringify(buildings) }</div>
        </div>
        {/*<div style={{ marginTop: '20px' }}>
          <h3>Objects:</h3>
          <div>{ JSON.stringify(objects) }</div>
        </div>*/}
      </div>
    );
  }
}
