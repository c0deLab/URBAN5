// Based on https://github.com/expo/expo-three/blob/master/example/screens/Simple.js

import { View as GraphicsView } from 'expo-graphics';
import ExpoTHREE, { THREE } from 'expo-three';
import React from 'react';
import { 
  Platform, 
  StyleSheet,
  View, 
} from 'react-native';

export default class Scene extends React.Component {
  componentDidMount() {
    THREE.suppressExpoWarnings();
  }
  onShouldReloadContext = () => {
    /// The Android OS loses gl context on background, so we should reload it.
    return Platform.OS === 'android';
  };

  render() {
    // Create an `ExpoGraphics.View` covering the whole screen, tell it to call our
    // `onContextCreate` function once it's initialized.
    return (
      <View style={styles.containerGraphics}>
        <GraphicsView 
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
          onShouldReloadContext={this.onShouldReloadContext}
        />
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
    this.renderer.setSize(200, 200);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x222222 );
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    this.drawCube({x:0, y:0, z:0});
    this.drawCube({x:0, y:1, z:0});
    this.drawCube({x:1, y:1, z:0});
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

  drawCube = (position) => {
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const wireframe = new THREE.EdgesGeometry( geometry );
    const material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
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
