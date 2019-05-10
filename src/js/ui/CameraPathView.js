import * as THREE from 'three';

import TopoRenderer3D from './TopoRenderer3D';
import DesignRenderer3D from './DesignRenderer3D';

/* global SETTINGS */

/** Class responsible for drawing a 3D view of the model */
export default class CameraPathView {
  constructor(container, session, cameraView, fov = 75) {
    this.container = container;
    this.target = null;
    this.session = session;

    // Set to true once the controller gives it a camera position
    this.hasPosition = false;

    // Setup Three.js scene, camera, and renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.camera = new THREE.PerspectiveCamera(fov, SETTINGS.w / SETTINGS.h, 1, 8000);
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(0.6);
    this.renderer.setSize(SETTINGS.w, SETTINGS.h);
    this.container.appendChild(this.renderer.domElement);
    this.cameraView = cameraView;

    this.draw();
  }

  draw = () => {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }

    this.designRenderer3D = new DesignRenderer3D();
    const design = this.session.design.getAll();
    this.designRenderer3D.draw(this.scene, design);

    this.topoRenderer3D = new TopoRenderer3D();
    const topoCorners = this.session.topo.getCorners();
    this.topoRenderer3D.draw(this.scene, topoCorners, this.cameraView);
  }

  render = () => {
    this.draw();
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Sets the camera position according to the given point
   * @param {object} p - A 3D point
   * @param {object} nextP - The next 3D point for direction
   */
  setCameraPosition = (p, nextP) => {
    this.hasPosition = true;
    const { x, y, z } = this.getAdjustedPoint(p);
    this.camera.position.x = x;
    this.camera.position.y = y;
    this.camera.position.z = z;

    // Point camera at next point
    const np = this.getAdjustedPoint(nextP);
    this.camera.lookAt(np.x, np.y, np.z);
    this.render();
  }

  /**
   * Returns the point adjusted for the 3D world
   * @param {object} p - A 3D point
   */
  getAdjustedPoint = p => {
    const { x, y, z } = p;
    return { x: x * SETTINGS.r + (SETTINGS.r / 2), y: z * SETTINGS.r + (SETTINGS.r * 0.75), z: -y * SETTINGS.r - (SETTINGS.r / 2) };
  }
}
