import React from 'react';
import PropTypes from 'prop-types';
import CameraPathController from '../../js/CameraPathController';
import CameraPathView from '../../js/CameraPathView';

/* global document */

/** Class for the 3D fly throughs of the model */
export default class CameraPath extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    path: PropTypes.array.isRequired // eslint-disable-line react/forbid-prop-types
  }

  componentDidMount() {
    this.isWired = false;

    this.container = document.getElementById('display3D');

    // If the model had already been created, immediately wire
    this.wire();

    const { path } = this.props;
    this.run(path);
  }

  componentDidUpdate() {
    // When the model is created, we need to wire it
    this.wire();

    const { path } = this.props;
    this.run(path);
  }

  /**
   * This should be called one time once the HTML element and the model are ready.
   * It sets up the rendering to the DOM.
   */
  wire = () => {
    const { model, path, onWalkthroughEnd } = this.props;
    if (this.isWired || !model || !path) {
      return;
    }
    this.isWired = true;

    this.controller = new CameraPathController(model, onWalkthroughEnd);
    this.view = new CameraPathView(this.container, model);
    this.controller.addListener(this.view);
  }

  run = path => {
    this.controller.run(path);
  }

  render() {
    this.width = 852;
    this.height = 852;

    return (
      <div id="display3D" style={{ width: this.width, height: this.height }} />
    );
  }
}
