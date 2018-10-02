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
    const touchX = event.locationX;
    const touchY = event.locationY;

    const mouseX = ( touchX/this.state.viewWidth ) * 2 - 1;
    const mouseY = - ( touchY/this.state.viewWidth ) * 2 + 1;

    const x = (Math.floor((touchX/this.state.viewWidth) * this.xMax)*this.r) + (this.r*0.5);
    const y = (Math.floor(((this.state.viewHeight-touchY)/this.state.viewHeight) * this.yMax)*this.r) + (this.r*0.5);

    this.setState({
      mouse2D: new THREE.Vector3(touchX, touchY, 0.00001),
      mouse3D: new THREE.Vector3(x, y, 0.00001),
    });

    switch(this.props.action) {
      case ActionsEnum.STEPOUT:
        this.setState({
          zoom: this.state.zoom-1,
        });
        break;
      case ActionsEnum.STEPIN:
        this.setState({
          zoom: this.state.zoom-1,
        });
        break;
      case ActionsEnum.ADDCUBE:
        this.drawCube({x:x, y:y, z:0});
        break;
      case ActionsEnum.REMVCUBE:
        //const raycaster = new THREE.Raycaster(new THREE.Vector3(x, y, 100), new THREE.Vector3(0, 0, -1));
        // const raycaster = new THREE.Raycaster();
        // raycaster.setFromCamera( new THREE.Vector3(mouseX, mouseY, 0.000001), this.camera );
        // var intersects = raycaster.intersectObjects( this.scene.children );
        // if ( intersects.length > 0 ) {
        //   if ( ROLLOVERED ) ROLLOVERED.color.setHex( 0x00ff80 );
        //   ROLLOVERED = intersects[ 0 ].face;
        //   ROLLOVERED.color.setHex( 0xff8000 );
        // }
        // this.setState({
        //   intersects: intersects,
        // });
        break;
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

    this.r = 10; // resolution
    this.xMin = 0; // resolution
    this.xMax = 15; // resolution
    this.yMin = 0; // resolution
    this.yMax = 10; // resolution
    const r = this.r;
    const xMin = this.xMin;
    const xMax = this.xMax;
    const yMin = this.yMin;
    const yMax = this.yMax;

    this.camera = new THREE.OrthographicCamera( xMin*r, xMax*r, yMax*r, yMin*r, 1, 1000 );
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 1;
    this.camera.zoom = 1;

    // grid
    // var gridSize = 200;
    // var gridHelper = new THREE.GridHelper( gridSize*r, gridSize );
    // gridHelper.rotation.x = Math.PI/2;
    // this.scene.add( gridHelper );

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
    this.drawCube({x:this.r*0.5, y:this.r*0.5, z:0});
    this.drawCube({x:this.r*0.5, y:this.r*1.5, z:0});
    this.drawCube({x:this.r*1.5, y:this.r*1.5, z:0});
  };

  drawCube = (position) => {
    const geometry = new THREE.BoxGeometry( this.r, this.r, this.r );
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
