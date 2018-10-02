// Based on https://github.com/expo/expo-three/blob/master/example/screens/Simple.js

import { View as GraphicsView } from 'expo-graphics';
import ExpoTHREE, { THREE } from 'expo-three';
import React from 'react';
import { 
  Platform, 
  StyleSheet,
  View,
} from 'react-native';
import TouchableView from './TouchableView';
import ActionsEnum from '../js/ActionsEnum';

export default class Scene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewWidth: 0,
      viewHeight: 0,
      zoom: 5,
      mouse2D: null,
      mouse3D: null,
    };
  }

  componentDidMount() {
    THREE.suppressExpoWarnings();
  }

  onClick = (event) => {

    switch(this.props.action) {
      case ActionsEnum.STEPOUT:
        this.setState({
          zoom: this.state.zoom-1,
        });
      case ActionsEnum.STEPIN:
        this.setState({
          zoom: this.state.zoom-1,
        });
      case ActionsEnum.ADDCUBE:
        const x = event.locationX;
        const y = event.locationY;
        this.drawCube({x:x, y:y, z:0});
      case ActionsEnum.REMVCUBE:
        this.setState({
          zoom: this.state.zoom-1,
        });
    }
  }

  onShouldReloadContext = () => {
    /// The Android OS loses gl context on background, so we should reload it.
    return Platform.OS === 'android';
  };

  onLayout = (event) => {
    var {x, y, width, height} = event.nativeEvent.layout;
    this.setState({
      viewWidth: width,
      viewHeight: height,
    });
  };

  render() {
    // Create an `ExpoGraphics.View` covering the whole screen, tell it to call our
    // `onContextCreate` function once it's initialized.
    return (
      <TouchableView 
        onTouchesBegan={this.onClick}
        style={styles.containerGraphics} 
        onLayout={this.onLayout}>
        <GraphicsView 
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
          onShouldReloadContext={this.onShouldReloadContext}
        />
      </TouchableView>
    );
  }

  // This is called by the `ExpoGraphics.View` once it's initialized
  onContextCreate = async ({
    gl,
    canvas,
    width,
    height,
    scale: pixelRatio,
  }) => {
    this.renderer = new ExpoTHREE.Renderer({
      gl,
      canvas,
      width,
      height,
      pixelRatio,
    });
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x222222 );

    this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 100;
    this.camera.zoom = 5;

    // this.mouse2D = new THREE.Vector3( 0, 10000, 0.5 );
    // this.mouse3D = null;
    // this.ray = new THREE.Ray( this.camera.position, null );

    // grid
    var gridSize = 200;
    var gridSquareSize = 20;
    var gridHelper = new THREE.GridHelper( gridSize*gridSquareSize, gridSize );
    gridHelper.rotation.x = Math.PI/2;
    this.scene.add( gridHelper );

    this.drawTopography();
    this.drawCubes();
  };

  onResize = ({ width, height, scale }) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = delta => {
    this.renderer.render(this.scene, this.camera);
  };

  drawTopography = () => {
    var material = new THREE.LineBasicMaterial( { color: 0xffffff } );
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( -400, 0, 0) );
    geometry.vertices.push(new THREE.Vector3( 400, 0, 0) );
    var line = new THREE.Line( geometry, material );
    this.scene.add( line );
  };

  drawCubes = () => {
    this.drawCube({x:-10, y:10, z:0});
    this.drawCube({x:-10, y:30, z:0});
    this.drawCube({x:10, y:10, z:0});
  };

  drawCube = (position) => {
    const geometry = new THREE.BoxGeometry( 20, 20, 20 );
    const wireframe = new THREE.EdgesGeometry( geometry );
    const material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1 } );
    const line = new THREE.LineSegments( wireframe, material );
    line.position.x = position.x;
    line.position.y = position.y;
    line.position.z = position.z;
    this.scene.add( line );
  };
}

const styles = StyleSheet.create({
  containerGraphics: {
    backgroundColor: '#222222',
    width: '100%',
    height: '100%',
  },
});
