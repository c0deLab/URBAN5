import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import ObjectsEnum from '../../js/enums/ObjectsEnum';

export default class Display3D extends React.Component {
  static propTypes = {
    action: PropTypes.number,
    controller: PropTypes.object,
    model: PropTypes.object
  }

  componentDidMount() {
    this.isWired = false;
    this.container = document.getElementById('three_viewer');
    document.addEventListener('keydown', this.handleKeyDown);
    this.wire();
  }

  componentDidUpdate() {
    this.wire();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = event => {
    console.log(event.keyCode);

    switch (event.keyCode) {
      case 87: // w
        this.camera.position.z -= this.r;
        break;
      // case 65: // a
      //   this.camera.rotation.y += Math.PI / 2;
      //   break;
      // case 68: // d
      //   this.camera.rotation.y -= Math.PI / 2;
      //   break;
      case 83: // s
        this.camera.position.z += this.r;
        break;
      default:
        break;
    }
  }

  wire = () => {
    const { model } = this.props;
    if (this.isWired || !model) {
      return;
    }
    this.isWired = true;

    this.width = 852;
    this.height = 852;
    this.gridSize = 17;
    this.r = (this.width - 2) / this.gridSize;

    this.positions = [[10, 0], [10, 1], [10, 2], [10, 3], [10, 4]];
    this.currentIndex = 0;
    this.t = 0;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    const currentPosition = this.positions[this.currentIndex];
    this.setCameraPosition(currentPosition[0], currentPosition[1]);

    this.scene.add(this.camera);

    this.addModelToScene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);
    this.animate();
  };

  setCameraPosition = (x, y, z = 0) => {
    this.camera.position.x = x * this.r;
    this.camera.position.y = z * this.r + (this.r / 2);
    this.camera.position.z = -y * this.r;
  };

  addModelToScene = () => {
    const { model } = this.props;
    if (!model) {
      return;
    }

    const { objects } = model;
    for (let z = 0; z < 7; z += 1) {
      for (let y = 0; y < 17; y += 1) {
        for (let x = 0; x < 17; x += 1) {
          const object = objects[z][y][x];
          switch (object) {
            case ObjectsEnum.CUBE:
              this.drawCube(x, y, z);
              break;
            case ObjectsEnum.TREE:
              this.drawTree(x, y, z);
              break;
            case ObjectsEnum.FOLIAGE:
              this.drawFoliage(x, y, z);
              break;
            case ObjectsEnum.ROOFLEFT:
              this.drawRoofLeft(x, y, z);
              break;
            case ObjectsEnum.ROOFRGHT:
              this.drawRoofRight(x, y, z);
              break;
            default:
              // Draw nothing
              break;
          }
        }
      }
    }
  };

  drawCube = (x, y, z) => {
    const geometry = new THREE.BoxGeometry(this.r, this.r, this.r);
    console.log(geometry);
    const wireframe = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 10 });
    const lines = new THREE.LineSegments(wireframe, material);
    const position = { x: x * this.r, y: z * this.r, z: -y * this.r };
    lines.position.x = position.x + (this.r / 2);
    lines.position.y = position.y + (this.r / 2);
    lines.position.z = position.z - (this.r / 2);
    this.scene.add(lines);
  };

  drawTree = (x, y, z) => {
    const radius = this.r / 10;
    const geometry = new THREE.CylinderGeometry(radius, radius, this.r, 6);
    const wireframe = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 10 });
    const lines = new THREE.LineSegments(wireframe, material);
    const position = { x: x * this.r, y: z * this.r, z: -y * this.r };
    lines.position.x = position.x + (this.r / 2);
    lines.position.y = position.y + (this.r / 2);
    lines.position.z = position.z - (this.r / 2);
    this.scene.add(lines);
  };

  drawFoliage = (x, y, z) => {
    const geometry = new THREE.SphereGeometry(this.r / 2, 6, 6);
    const wireframe = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 10 });
    const lines = new THREE.LineSegments(wireframe, material);
    const position = { x: x * this.r, y: z * this.r, z: -y * this.r };
    lines.position.x = position.x + (this.r / 2);
    lines.position.y = position.y + (this.r / 2);
    lines.position.z = position.z - (this.r / 2);
    this.scene.add(lines);
  };

  drawRoofLeft = (x, y, z) => {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -this.r),
      new THREE.Vector3(this.r, 0, -this.r),
      new THREE.Vector3(this.r, 0, 0),
      new THREE.Vector3(this.r, this.r, 0),
      new THREE.Vector3(this.r, this.r, -this.r)
    );
    geometry.faces.push(
      new THREE.Face3(0, 1, 2, 3),
      new THREE.Face3(2, 3, 4, 5),
      new THREE.Face3(0, 3, 4),
      new THREE.Face3(1, 2, 5),
      new THREE.Face3(0, 1, 4, 5)
    );
    const wireframe = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 10 });
    const lines = new THREE.LineSegments(wireframe, material);
    const position = { x: x * this.r, y: z * this.r, z: -y * this.r };
    lines.position.x = position.x;
    lines.position.y = position.y;
    lines.position.z = position.z;
    this.scene.add(lines);
  };

  drawRoofRight = (x, y, z) => {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -this.r),
      new THREE.Vector3(this.r, 0, -this.r),
      new THREE.Vector3(this.r, 0, 0),
      new THREE.Vector3(0, this.r, 0),
      new THREE.Vector3(0, this.r, -this.r)
    );
    geometry.faces.push(
      new THREE.Face3(0, 1, 2, 3),
      new THREE.Face3(2, 3, 4, 5),
      new THREE.Face3(0, 3, 4),
      new THREE.Face3(1, 2, 5),
      new THREE.Face3(0, 1, 4, 5)
    );
    const wireframe = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 10 });
    const lines = new THREE.LineSegments(wireframe, material);
    const position = { x: x * this.r, y: z * this.r, z: -y * this.r };
    lines.position.x = position.x;
    lines.position.y = position.y;
    lines.position.z = position.z;
    this.scene.add(lines);
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
    this.t += 1;
    if (this.t > 20 && this.currentIndex < this.positions.length - 1) {
      this.currentIndex += 1;
      const currentPosition = this.positions[this.currentIndex];
      this.setCameraPosition(currentPosition[0], currentPosition[1]);
      this.t = 0;
    }
  };

  render() {
    return (
      <div id="three_viewer" style={{ width: '100%', height: '100%' }} />
    );
  }
}
