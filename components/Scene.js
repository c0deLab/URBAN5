// Based on https://github.com/expo/expo-three/blob/master/example/screens/Simple.js

import { View as GraphicsView } from 'expo-graphics';
import ExpoTHREE, { THREE } from 'expo-three';
import React from 'react';
import { 
  Platform, 
  StyleSheet,
  View,
  Text,
} from 'react-native';
import TouchableView from './TouchableView';
import ActionsEnum from '../js/ActionsEnum';

export default class Scene extends React.Component {
  constructor(props) {
    super(props);

    this.r = 10; // resolution
    this.xMin = 0;
    this.xMax = 14;
    this.yMin = 0;
    this.yMax = 9;
    this.zMin = 0;
    this.zMax = 9;

    // Create 3D array of cubes
    const objects = [];
    let xRow, yRow;
    for (let i = this.xMin; i <= this.xMax; i++) {
      xRow = [];
      for (let j = this.yMin; j <= this.yMax; j++) {
        yRow = [];
        for (let k = this.zMin; k <= this.zMax; k++) {
          yRow.push(null);
        }
        xRow.push(yRow);
      }
      objects.push(xRow);
    }

    this.state = {
      viewWidth: 0,
      viewHeight: 0,
      x: 0,
      y: 0,
      z: 0,
      objects: objects,
    };
  }

  componentDidMount() {
    THREE.suppressExpoWarnings();
  }

  onClick = (event) => {
    const touchX = event.locationX;
    const touchY = event.locationY;

    const x = (Math.floor((touchX/this.state.viewWidth) * (this.xMax+1)));
    const y = (Math.floor(((this.state.viewHeight-touchY)/this.state.viewHeight) * (this.yMax+1)));

    let z;
    switch(this.props.action) {
      case ActionsEnum.STEPOUT:
        z = Math.min(this.state.z + 1, this.zMax);
        this.setState({
          z: z,
        });
        this.camera.position.z = (z+1) * this.r;
        this.camera.updateProjectionMatrix();
        break;
      case ActionsEnum.STEPIN:
        z = Math.max(this.state.z - 1, 0);
        this.setState({
          z: z,
        });
        this.camera.position.z = (z+1) * this.r;
        this.camera.updateProjectionMatrix();
        break;
      case ActionsEnum.ADDCUBE:
        this.drawCube({x:x, y:y, z:this.state.z});
        break;
      case ActionsEnum.REMVCUBE:
        if (this.state.objects && this.state.objects.length > x && this.state.objects[x].length > y && this.state.objects[y].length > this.state.z) {
          const objectSelected = this.state.objects[x][y][this.state.z];
          if (objectSelected) {
            this.scene.remove(objectSelected);
          }
          break;
        }
    }
    this.setState({
      x: x,
      y: y,
    });
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
      <View>
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
        <Text style={styles.debugText}>x: {this.state.x}, y: {this.state.y}, z: {this.state.z}</Text>
      </View>
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

    this.camera = new THREE.OrthographicCamera( this.xMin*this.r, (this.xMax+1)*this.r, (this.yMax+1)*this.r, this.yMin*this.r, 0, this.r );
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = (this.r*(this.state.z+1));
    this.camera.zoom = 1;

    // grid
    // var gridSize = 200;
    // var gridHelper = new THREE.GridHelper( gridSize*r, gridSize );
    // gridHelper.rotation.x = Math.PI/2;
    // this.scene.add( gridHelper );

    this.drawTopography();
    this.drawCubes();
    this.setState({
      children: this.scene.children,
    });
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
    this.drawCube({x:0, y:0, z:0});
    this.drawCube({x:1, y:1, z:1});
    this.drawCube({x:2, y:2, z:2});
    this.drawCube({x:3, y:3, z:3});
  };

  drawCube = (position) => {
    const geometry = new THREE.BoxGeometry( this.r, this.r, this.r-0.00001 );
    const wireframe = new THREE.EdgesGeometry( geometry );
    const material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1 } );
    const line = new THREE.LineSegments( wireframe, material );
    line.position.x = (position.x+0.5)*this.r;
    line.position.y = (position.y+0.5)*this.r;
    line.position.z = (position.z+0.5)*this.r;
    this.scene.add( line );
    // var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    // var cube = new THREE.Mesh( geometry, material );
    // cube.position.x = position.x;
    // cube.position.y = position.y;
    // cube.position.z = position.z;
    // this.scene.add( cube );
    this.state.objects[position.x][position.y][position.z] = line;
    this.setState({
      objects: this.state.objects,
    });
  };
}

const styles = StyleSheet.create({
  containerGraphics: {
    backgroundColor: '#222222',
    width: 600,
    height: 450,
    // borderWidth: 1,
    // borderStyle: 'solid',
    // borderColor: '#ffffff',
  },
  debugText: {
    color: '#ffffff',
  },
});
