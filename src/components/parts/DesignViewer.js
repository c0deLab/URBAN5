import React from 'react';
import DesignModel from '../../js/DesignModel';
import DesignRenderer from '../../js/DesignRenderer';
import ThreeViewer from './ThreeViewer';

export default class DesignViewer extends React.Component {

  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    // Add class to recieve inputs and update and store model
    this.designModel = new DesignModel(17, 7, 17);

    // Add class to create new scene or update scene as user makes changes (also responsible for line vs. dotted line rendering)
    const resolution = 50;
    const size = 17;
    this.designRenderer = new DesignRenderer(this.designModel, resolution, size);

    const scene = this.designRenderer.scene;
    const camera = this.designRenderer.camera;

    return (
      <ThreeViewer scene={scene} camera={camera}></ThreeViewer>
    );
  }
  
  handleKeyDown = (event) => {
    console.log(event.keyCode);
    switch( event.keyCode ) {
      case 87: // w
        this.designRenderer.top();
        break;
      case 88: // x
        this.designRenderer.bottom();
        break;
      case 83: // s
        this.designRenderer.north();
        break;
      case 70: // f
        this.designRenderer.south();
        break;
      case 65: // a
        this.designRenderer.west();
        break;
      case 68: // d
        this.designRenderer.east();
        break;
      case 38: // up
        this.designRenderer.nextSlice();
        break;
      case 40: // down
        this.designRenderer.previousSlice();
        break;
      default: 
        break;
    }
  }
}