import React from 'react';
import * as THREE from 'three';

export default class Three extends React.Component {
  componentDidMount() {
    this.container = document.getElementById('three_viewer');
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.container.appendChild(this.renderer.domElement);
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(850, 850);

    this.animate();
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    const { scene, camera } = this.state;
    this.renderer.render(scene, camera);
  };

  render() {
    return (
      <div id="three_viewer" style={{ width: '100%', height: '100%' }} />
    );
  }
}
