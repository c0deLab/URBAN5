import * as THREE from 'three';
import { getEmpty2DArray } from './ArrayHelpers';

/* global SETTINGS */
/* global requestAnimationFrame */
/* global window */
const material = new THREE.LineBasicMaterial({ color: 0xE8E8DA });

/** Class responsible for drawing a 3D view of the model */
export default class CameraPathView {
  constructor(container, model) {
    this.container = container;

    this.width = SETTINGS.w;
    this.height = SETTINGS.h;
    this.gridSize = SETTINGS.gridSize;
    this.xMax = SETTINGS.xMax;
    this.yMax = SETTINGS.yMax;
    this.zMax = SETTINGS.zMax;
    this.r = SETTINGS.r;
    this.target = null;

    // Set to true once the controller gives it a camera position
    this.hasPosition = false;

    // Setup Three.js scene, camera, and renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 1000);
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(0.6);
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);

    this.addModelToScene(model);
    this.addTopoToScene(model);

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
  }

  /**
   * Returns the point adjusted for the 3D world
   * @param {object} p - A 3D point
   */
  getAdjustedPoint = p => {
    const { x, y, z } = p;
    return { x: x * this.r, y: z * this.r + (this.r / 2), z: -y * this.r };
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
          if (object) {
            object.draw3D(this.scene);
          }
        }
      }
    }
  }

  /**
   * Add the topography to the scene
   * @param {object} model - DesignModel
   */
  addTopoToScene = model => {
    if (!model || !model.topo) {
      return;
    }

    const { topo } = model;
    // Get 2D array of all the corners (at each corner use the highest adjacent tile)
    const corners = topo.getTopoCorners();

    // calculate the corners of all the topography and connect them
    const adjustedCorners = getEmpty2DArray(this.xMax + 1, this.yMax + 1, null);
    for (let y = 0; y <= this.yMax; y += 1) {
      for (let x = 0; x <= this.xMax; x += 1) {
        const cornerPoint = { x, y, z: corners[y][x] - 0.5 };
        const adjustedCornerPoint = this.getAdjustedPoint(cornerPoint);
        // Drop the height by half a block
        adjustedCornerPoint.z -= 0.5;
        adjustedCorners[y][x] = adjustedCornerPoint;

        // Connect down and right
        if (y > 0) {
          const downPoint = adjustedCorners[y - 1][x];
          this._addLine(adjustedCornerPoint, downPoint);
        }
        if (x > 0) {
          const leftPoint = adjustedCorners[y][x - 1];
          this._addLine(adjustedCornerPoint, leftPoint);
        }
      }
    }
  }

  _addLine = (p0, p1) => {
    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(p0.x, p0.y, p0.z));
    geometry.vertices.push(new THREE.Vector3(p1.x, p1.y, p1.z));
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
  }
}
