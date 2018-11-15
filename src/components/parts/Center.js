import React from 'react';
import PropTypes from 'prop-types';

import DesignModel from '../../js/DesignModel';
import Display2D from './Display2D';
import CameraPath from './CameraPath';

/* global document */

/** Class for the main display of URBAN5 that can switch between various views */
export default class Center extends React.Component {
  static propTypes = {
    action: PropTypes.number.isRequired
  }

  state = {
    model: null,
    displayType: '2D'
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);

    const model = new DesignModel();
    this.setState({
      model
    });
  }

  handleKeyDown = event => {
    // Switch between views
    switch (event.keyCode) {
      case 86: // v
        this.setState({
          displayType: '2D'
        });
        break;
      case 66: // b
        this.setState({
          displayType: 'PATH'
        });
        break;
      default:
        break;
    }
  }

  getDisplay = () => {
    const { action } = this.props;
    const {
      model, displayType
    } = this.state;

    if (!model || !action) {
      return null;
    }

    // Test camera path, TODO: should be set by user selection
    const cameraPath = [];
    for (let i = 0; i < 10; i += 1) {
      cameraPath.push({ x: 10, y: i, z: 0 });
    }

    switch (displayType) {
      case '2D':
        return (<Display2D action={action} model={model} />);
      case 'PATH':
        return (<CameraPath model={model} cameraPath={cameraPath} />);
      default:
        break;
    }

    return null;
  }

  render() {
    return (
      <div>
        {this.getDisplay()}
      </div>
    );
  }
}
