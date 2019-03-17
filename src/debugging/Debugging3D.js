import React from 'react';
import PropTypes from 'prop-types';
import CameraPathController from '../js/CameraPathController';
import CameraPathView from '../js/CameraPathView';

/* global document */
/* global SETTINGS */

/** Class for the 3D fly throughs of the model */
export default class Debugging3D extends React.Component {
  static propTypes = {
    session: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    run: false
  }

  size = 400;

  componentDidMount() {
    this.container = document.getElementById('debuggingDisplay3D');

    const { session } = this.props;
    this.view = new CameraPathView(this.container, session);
    this.view.renderer.setSize(this.size, this.size);
    const target = { x: 8, y: 8, z: 0 };
    const d0 = -3;
    const d1 = 20;
    const m0 = 8;
    const m1 = -10;
    const z = 6;
    const origins = [{ x: d0, y: d0, z }, { x: m0, y: m1, z },
      { x: d1, y: d0, z }, { x: d1 + m0, y: m0, z },
      { x: d1, y: d1, z }, { x: m0, y: d1 + m0, z },
      { x: d0, y: d1, z }, { x: -m0, y: m0, z }
    ];

    this.view.setCameraPosition(origins[0], target);

    let timer = 0;
    const updateSpeed = 1;

    const poll = () => {
      const { run } = this.state;
      this.view.draw();

      if (run) {
        timer += 1;
        this.view.setCameraPosition(origins[Math.floor((timer / updateSpeed)) % origins.length], target);
      }

      setTimeout(poll, 1000);
    };
    poll();
  }

  render() {
    const { run } = this.state;
    return (
      <div style={{ position: 'absolute', right: '10px', top: '10px', color: '#000', width: this.size + 'px' }}>
        <div id="debuggingDisplay3D" style={{ width: this.size + 'px', height: this.size + 'px' }} />
        <button style={{ border: '1px solid #000', margin: '10px', padding: '4px 10px' }} onMouseDown={() => this.setState({ run: !run })}>Rotate</button>
      </div>
    );
  }
}
