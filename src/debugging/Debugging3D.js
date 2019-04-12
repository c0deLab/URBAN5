import React from 'react';
import PropTypes from 'prop-types';
import CameraPathView from '../js/CameraPathView';

/* global document */

/** Class for the 3D fly throughs of the model */
export default class Debugging3D extends React.Component {
  static propTypes = {
    session: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  size = 500;

  componentDidMount() {
    this.container = document.getElementById('debuggingDisplay3D');

    const { session, cameraView } = this.props;
    this.view = new CameraPathView(this.container, session, cameraView);
    this.view.renderer.setSize(this.size - 1, this.size - 1);
    this.target = { x: 8, y: 8, z: 0 };
    const d0 = -3;
    const d1 = 20;
    const m0 = 8;
    const m1 = -10;
    const z = 6;
    this.origins = [{ x: d0, y: d0, z }, { x: m0, y: m1, z },
      { x: d1, y: d0, z }, { x: d1 + m0, y: m0, z },
      { x: d1, y: d1, z }, { x: m0, y: d1 + m0, z },
      { x: d0, y: d1, z }, { x: -m0, y: m0, z }
    ];

    this.location = -1;
    this.nextRotation();

    let lastCameraView = {};
    let lastNumObjects = 0;
    let lastTotalHeight = 0;
    const poll = () => {
      setTimeout(() => {
        const numObjects = session._design._objects.length;
        const totalHeight = session._topo.heights.reduce((total, num) => total + num);
        if (cameraView.camera !== lastCameraView.camera || cameraView.slices.x !== lastCameraView.slices.x
            || cameraView.slices.y !== lastCameraView.slices.y || numObjects !== lastNumObjects || totalHeight !== lastTotalHeight) {
          this.view.render();
          lastCameraView = {
            camera: cameraView.camera,
            slices: {
              x: cameraView.slices.x,
              y: cameraView.slices.y,
              z: cameraView.slices.z,
            }
          };
          lastNumObjects = numObjects;
          lastTotalHeight = totalHeight;
        }

        poll();
      }, 100);
    };
    poll();
  }

  nextRotation = () => {
    this.location = (this.location + 1) % this.origins.length;
    this.view.setCameraPosition(this.origins[this.location], this.target);
  }

  render() {
    return (
      <div style={{ position: 'absolute', right: '20px', top: '20px', color: '#000', border: '1px solid #E8E8DA', width: this.size + 'px' }}>
        <div id="debuggingDisplay3D" style={{ width: this.size + 'px', height: this.size + 'px' }} />
        <button style={{ border: '1px solid #E8E8DA', margin: '10px', padding: '4px 10px', color: '#E8E8DA' }} onMouseDown={this.nextRotation}>Toggle Rotate</button>
      </div>
    );
  }
}
