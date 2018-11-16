import React from 'react';
import PropTypes from 'prop-types';
import CameraPathController from '../../js/CameraPathController';
import CameraPathView from '../../js/CameraPathView';

/* global document */

/** Class for the 3D fly throughs of the model */
export default class CameraPath extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    cameraPath: PropTypes.array.isRequired // eslint-disable-line react/forbid-prop-types
  }

  componentDidMount() {
    this.isWired = false;

    this.container = document.getElementById('display3D');
    document.addEventListener('keydown', this.handleKeyDown);

    // If the model had already been created, immediately wire
    this.wire();
  }

  componentDidUpdate() {
    // When the model is created, we need to wire it
    this.wire();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /** Add some hotkeys to make testing easier */
  handleKeyDown = event => {
    switch (event.keyCode) {
      case 87: // w Forward
        this.camera.position.z -= this.r;
        break;
      case 83: // s Back
        this.camera.position.z += this.r;
        break;
      default:
        break;
    }
  }

  /**
   * This should be called one time once the HTML element and the model are ready.
   * It sets up the rendering to the DOM.
   */
  wire = () => {
    const { model, cameraPath } = this.props;
    if (this.isWired || !model || !cameraPath) {
      return;
    }
    this.isWired = true;

    const controller = new CameraPathController(model, cameraPath);
    this.view = new CameraPathView(this.container, model);
    controller.addListener(this.view);
  }

  render() {
    this.width = 852;
    this.height = 852;

    return (
      <div id="display3D" style={{ width: this.width, height: this.height }} />
    );
  }
}
