import * as THREE from 'three';
import SurfacesEnum from '../enums/SurfacesEnum';
import Cube from '../api/Cube';
import { Trunk, Foliage } from '../api/Tree';
import Roof from '../api/Roof';

/* global SETTINGS */

class DesignRenderer3D {
  draw = (scene, objects) => {
    if (!objects) {
      return;
    }

    for (let z = 0; z < SETTINGS.zMax; z += 1) {
      for (let y = 0; y < SETTINGS.yMax; y += 1) {
        for (let x = 0; x < SETTINGS.xMax; x += 1) {
          const object = objects[z][y][x];
          const position = { x, y, z };
          if (object) {
            switch (object.constructor) {
              case Cube:
                this.drawCube(scene, object, position);
                break;
              case Roof:
                this.drawRoof(scene, object, position);
                break;
              case Foliage:
                this.drawFoliage(scene, position);
                break;
              case Trunk:
                this.drawTrunk(scene, position);
                break;
              default:
                break;
            }
          }
        }
      }
    }
  }

  drawCube = (scene, cube, position) => {
    const lines = this._getCubeFaces(cube);

    const positionAdj = { x: position.x * SETTINGS.r, y: position.z * SETTINGS.r, z: -position.y * SETTINGS.r };

    lines.position.x = positionAdj.x;
    lines.position.y = positionAdj.y;
    lines.position.z = positionAdj.z;
    scene.add(lines);
  };

  _getCubeFaces = cube => {
    const geometry = new THREE.Geometry();

    if (cube.surfaces.t === SurfacesEnum.SOLID) {
      geometry.vertices.push(
        // top face
        new THREE.Vector3(0, SETTINGS.r, 0),
        new THREE.Vector3(SETTINGS.r, SETTINGS.r, 0),
        new THREE.Vector3(SETTINGS.r, SETTINGS.r, 0),
        new THREE.Vector3(SETTINGS.r, SETTINGS.r, -SETTINGS.r),
        new THREE.Vector3(SETTINGS.r, SETTINGS.r, -SETTINGS.r),
        new THREE.Vector3(0, SETTINGS.r, -SETTINGS.r),
        new THREE.Vector3(0, SETTINGS.r, -SETTINGS.r),
        new THREE.Vector3(0, SETTINGS.r, 0),
      );
    }
    if (cube.surfaces.b === SurfacesEnum.SOLID) {
      geometry.vertices.push(
        // bottom face
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(SETTINGS.r, 0, 0),
        new THREE.Vector3(SETTINGS.r, 0, 0),
        new THREE.Vector3(SETTINGS.r, 0, -SETTINGS.r),
        new THREE.Vector3(SETTINGS.r, 0, -SETTINGS.r),
        new THREE.Vector3(0, 0, -SETTINGS.r),
        new THREE.Vector3(0, 0, -SETTINGS.r),
        new THREE.Vector3(0, 0, 0),
      );
    }
    if (cube.surfaces.n === SurfacesEnum.SOLID) {
      geometry.vertices.push(
        // north face
        new THREE.Vector3(0, 0, -SETTINGS.r),
        new THREE.Vector3(SETTINGS.r, 0, -SETTINGS.r),
        new THREE.Vector3(SETTINGS.r, 0, -SETTINGS.r),
        new THREE.Vector3(SETTINGS.r, SETTINGS.r, -SETTINGS.r),
        new THREE.Vector3(SETTINGS.r, SETTINGS.r, -SETTINGS.r),
        new THREE.Vector3(0, SETTINGS.r, -SETTINGS.r),
        new THREE.Vector3(0, SETTINGS.r, -SETTINGS.r),
        new THREE.Vector3(0, 0, -SETTINGS.r),
      );
    }
    if (cube.surfaces.s === SurfacesEnum.SOLID) {
      geometry.vertices.push(
        // south face
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(SETTINGS.r, 0, 0),
        new THREE.Vector3(SETTINGS.r, 0, 0),
        new THREE.Vector3(SETTINGS.r, SETTINGS.r, 0),
        new THREE.Vector3(SETTINGS.r, SETTINGS.r, 0),
        new THREE.Vector3(0, SETTINGS.r, 0),
        new THREE.Vector3(0, SETTINGS.r, 0),
        new THREE.Vector3(0, 0, 0),
      );
    }
    if (cube.surfaces.e === SurfacesEnum.SOLID) {
      geometry.vertices.push(
        // east face
        new THREE.Vector3(SETTINGS.r, 0, 0),
        new THREE.Vector3(SETTINGS.r, SETTINGS.r, 0),
        new THREE.Vector3(SETTINGS.r, SETTINGS.r, 0),
        new THREE.Vector3(SETTINGS.r, SETTINGS.r, -SETTINGS.r),
        new THREE.Vector3(SETTINGS.r, SETTINGS.r, -SETTINGS.r),
        new THREE.Vector3(SETTINGS.r, 0, -SETTINGS.r),
        new THREE.Vector3(SETTINGS.r, 0, -SETTINGS.r),
        new THREE.Vector3(SETTINGS.r, 0, 0),
      );
    }
    if (cube.surfaces.w === SurfacesEnum.SOLID) {
      geometry.vertices.push(
        // west face
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, SETTINGS.r, 0),
        new THREE.Vector3(0, SETTINGS.r, 0),
        new THREE.Vector3(0, SETTINGS.r, -SETTINGS.r),
        new THREE.Vector3(0, SETTINGS.r, -SETTINGS.r),
        new THREE.Vector3(0, 0, -SETTINGS.r),
        new THREE.Vector3(0, 0, -SETTINGS.r),
        new THREE.Vector3(0, 0, 0),
      );
    }

    const lines = new THREE.LineSegments(geometry, SETTINGS.material);

    return lines;
  }

  drawRoof = (scene, roof, position) => {
    const lines = this._getRoof(roof);

    const positionAdj = { x: position.x * SETTINGS.r, y: position.z * SETTINGS.r, z: -position.y * SETTINGS.r };

    switch (roof.direction) {
      case 'n':
        break;
      case 'e':
        lines.rotation.y = Math.PI * 1.5;
        positionAdj.z -= SETTINGS.r;
        break;
      case 's':
        lines.rotation.y = Math.PI;
        positionAdj.x += SETTINGS.r;
        positionAdj.z -= SETTINGS.r;
        break;
      case 'w':
        lines.rotation.y = Math.PI * 0.5;
        positionAdj.x += SETTINGS.r;
        break;
      default:
        return;
    }
    lines.position.x = positionAdj.x;
    lines.position.y = positionAdj.y;
    lines.position.z = positionAdj.z;
    scene.add(lines);
  };

  _getRoof = roof => {
    const geometry = new THREE.Geometry();

    if (roof.hasSideSurface) {
      geometry.vertices.push(
        // tall face bottom
        new THREE.Vector3(0, SETTINGS.r, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(SETTINGS.r, 0, 0),
        new THREE.Vector3(SETTINGS.r, 0, 0),
        new THREE.Vector3(SETTINGS.r, SETTINGS.r, 0),
      );
    }

    geometry.vertices.push(
      // slanted face
      new THREE.Vector3(0, 0, -SETTINGS.r),
      new THREE.Vector3(0, SETTINGS.r, 0),
      new THREE.Vector3(0, SETTINGS.r, 0),
      new THREE.Vector3(SETTINGS.r, SETTINGS.r, 0),
      new THREE.Vector3(SETTINGS.r, SETTINGS.r, 0),
      new THREE.Vector3(SETTINGS.r, 0, -SETTINGS.r),
      new THREE.Vector3(SETTINGS.r, 0, -SETTINGS.r),
      new THREE.Vector3(0, 0, -SETTINGS.r),
    );

    const lines = new THREE.LineSegments(geometry, SETTINGS.material);

    return lines;
  }

  drawFoliage = (scene, center) => {
    const { x, y, z } = center;
    const geometry = new THREE.SphereGeometry(SETTINGS.r / 2, 5, 5);
    const wireframe = new THREE.EdgesGeometry(geometry);
    const lines = new THREE.LineSegments(wireframe, SETTINGS.material);
    const position = { x: x * SETTINGS.r, y: z * SETTINGS.r, z: -y * SETTINGS.r };
    lines.position.x = position.x + (SETTINGS.r / 2);
    lines.position.y = position.y + (SETTINGS.r / 2);
    lines.position.z = position.z - (SETTINGS.r / 2);
    scene.add(lines);
  };

  drawTrunk = (scene, center) => {
    const { x, y, z } = center;
    const position = { x: (x + 0.5) * SETTINGS.r, y: z * SETTINGS.r, z: (-y - 0.5) * SETTINGS.r };
    const position2 = { x: position.x, y: position.y + SETTINGS.r, z: position.z };
    this._addLine(scene, position, position2);
  };

  _addLine = (scene, p0, p1) => {
    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(p0.x, p0.y, p0.z));
    geometry.vertices.push(new THREE.Vector3(p1.x, p1.y, p1.z));
    const line = new THREE.Line(geometry, SETTINGS.material);
    scene.add(line);
  }
}

export default DesignRenderer3D;
