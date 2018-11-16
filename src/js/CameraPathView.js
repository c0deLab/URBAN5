import * as THREE from 'three';
import ObjectsEnum from './enums/ObjectsEnum';

/* global requestAnimationFrame */

/** Class responsible for drawing a 3D view of the model */
export default class CameraPathView {
  constructor(container, model) {
    this.container = container;

    this.width = 852;
    this.height = 852;
    this.gridSize = 17;
    this.xMax = 17;
    this.yMax = 17;
    this.zMax = 7;
    this.r = (this.width - 2) / this.gridSize;

    // Set to true once the controller gives it a camera position
    this.hasPosition = false;

    // Setup Three.js scene, camera, and renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);

    this.addModelToScene(model);
    // TODO: Add topography to scene

    this.animate();
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    // Wait until the controller has set the position to start animating
    if (!this.hasPosition) {
      return;
    }
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Sets the camera position according to the given point
   * @param {object} p - A 3D point
   */
  setCameraPosition = p => {
    this.hasPosition = true;
    const { x, y, z } = p;
    this.camera.position.x = x * this.r;
    this.camera.position.y = z * this.r + (this.r / 2);
    this.camera.position.z = -y * this.r;
  }

  /**
   * Add the objects in the model to the scene
   * TODO: Make buildings join properly
   * TODO: Make trees match URBAN5 look
   * @param {object} model - DesignModel
   */
  addModelToScene = model => {
    if (!model) {
      return;
    }

    const { objects } = model;
    for (let z = 0; z < this.zMax; z += 1) {
      for (let y = 0; y < this.yMax; y += 1) {
        for (let x = 0; x < this.xMax; x += 1) {
          const object = objects[z][y][x];
          switch (object) {
            case ObjectsEnum.CUBE:
              this._addCube(x, y, z);
              break;
            case ObjectsEnum.TREE:
              this._addTree(x, y, z);
              break;
            case ObjectsEnum.FOLIAGE:
              this._addFoliage(x, y, z);
              break;
            case ObjectsEnum.ROOFLEFT:
              this._addRoofLeft(x, y, z);
              break;
            case ObjectsEnum.ROOFRGHT:
              this._addRoofRight(x, y, z);
              break;
            default:
              // Draw nothing
              break;
          }
        }
      }
    }
  }

  _addCube = (x, y, z) => {
    const geometry = new THREE.BoxGeometry(this.r, this.r, this.r);
    const wireframe = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 10 });
    const lines = new THREE.LineSegments(wireframe, material);
    const position = { x: x * this.r, y: z * this.r, z: -y * this.r };
    lines.position.x = position.x + (this.r / 2);
    lines.position.y = position.y + (this.r / 2);
    lines.position.z = position.z - (this.r / 2);
    this.scene.add(lines);
  }

  _addTree = (x, y, z) => {
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
  }

  _addFoliage = (x, y, z) => {
    const geometry = new THREE.SphereGeometry(this.r / 2, 6, 6);
    const wireframe = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 10 });
    const lines = new THREE.LineSegments(wireframe, material);
    const position = { x: x * this.r, y: z * this.r, z: -y * this.r };
    lines.position.x = position.x + (this.r / 2);
    lines.position.y = position.y + (this.r / 2);
    lines.position.z = position.z - (this.r / 2);
    this.scene.add(lines);
  }

  _addRoofLeft = (x, y, z) => {
    const geometry = new THREE.Geometry();
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
  }

  _addRoofRight = (x, y, z) => {
    const geometry = new THREE.Geometry();
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
  }
}
