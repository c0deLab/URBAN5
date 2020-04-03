import React from 'react';
import PropTypes from 'prop-types';
import CameraPathView from '../../js/CameraPathView';

/* global document */

/** Class for the 3D fly throughs of the model */
export default class Debugging3D extends React.Component {
  static propTypes = {
    session: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    cameraView: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    size: PropTypes.number.isRequired
  }

  componentDidMount() {
    this.container = document.getElementById('debuggingDisplay3D');

    const { session, cameraView, size } = this.props;
    this.view = new CameraPathView(this.container, session, cameraView, 20);
    this.view.renderer.setSize(size - 1, size - 1);
    this.target = { x: 8, y: 8, z: 0 };
    const z = 35;
    const offset = 55;
    const radius = 8;
    const cameraRadius = 8 + offset;
    const viewCount = 8;
    const increment = Math.PI * 2 / viewCount;
    this.origins = [];
    for (let i = 0; i < viewCount; i += 1) {
      const viewPoint = {
        x: (cameraRadius * Math.cos((i * increment) + (Math.PI * -0.5))) + radius,
        y: (cameraRadius * Math.sin((i * increment) + (Math.PI * -0.5))) + radius,
        z
      };
      this.origins.push(viewPoint);
    }

    this.location = -1;
    this.nextRotation();
  }

  componentWillUnmount() {
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout);
    }
  }

  startPoll = () => {
    const { session, cameraView } = this.props;
    clearTimeout(this.pollTimeout);

    let lastCameraView = {};
    let lastNumObjects = 0;
    let lastTotalHeight = 0;
    const poll = () => {
      this.pollTimeout = setTimeout(() => {
        if (session) {
          const numObjects = session.design.getObjects().length;
          const totalHeight = session._topo.heights.reduce((total, num) => total + num);
          if (cameraView.camera !== lastCameraView.camera || cameraView.slices.x !== lastCameraView.slices.x
              || cameraView.slices.y !== lastCameraView.slices.y || cameraView.slices.z !== lastCameraView.slices.z || numObjects !== lastNumObjects || totalHeight !== lastTotalHeight) {
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
    this.startPoll();

    return (
      <div>
        <div id="debuggingDisplay3D" style={{ textAlign: 'center' }} />
        <button type="button" style={{ border: '1px solid #E8E8DA', margin: '10px', padding: '4px 10px', color: '#E8E8DA' }} onMouseDown={this.nextRotation}>Toggle Rotate</button>
      </div>
    );
  }
}
