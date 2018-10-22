import * as THREE from 'three';
import ObjectsEnum from './ObjectsEnum';

export default class DesignRenderer {

  constructor(designModel, resolution, size) {
    this.designModel = designModel;
    this.r = resolution;
    this.size = size;

    this.camera = new THREE.OrthographicCamera( -1-this.r/2, 1+((this.size-1)*this.r)+this.r/2, 1+((this.size-1)*this.r)+this.r/2, -1-this.r/2, 0, this.r*18 );
    this.camera.zoom = 1;

    this.scene = new THREE.Scene();

    this.north();
    this.updateScene();

    window.camera = this.camera;
  }

  updateScene = () => {
    while(this.scene.children.length > 0){ 
      this.scene.remove(this.scene.children[0]); 
    }
    this.addPointsGridToScene();
    this.addTopoToScene();
    this.addObjectsToScene();
  };

  nextSlice = () => {
    console.log('next slice');
    switch(this.direction) {
      case 'NORTH':
      case 'EAST':
      case 'TOP':
        if (this.slice > 0) this.slice--;
        break;
      case 'WEST':
      case 'BOTTOM':
      case 'SOUTH':
        if (this.slice < this.size-1) this.slice++;
        break;
    }
    this.updateScene();
  };

  previousSlice = () => {
    console.log('previous slice');
    switch(this.direction) {
      case 'NORTH':
      case 'EAST':
      case 'TOP':
        if (this.slice < this.size-1) this.slice++;
        break;
      case 'WEST':
      case 'BOTTOM':
      case 'SOUTH':
        if (this.slice > 0) this.slice--;
        break;
    }
    this.updateScene();
  };

  north = () => {
    console.log('north');
    this.direction = 'NORTH';
    this.slice = this.size-1;
    this.setDirection({x:0,y:0,z:0}, {x:0,y:0,z:this.size*this.r});
  };

  west = () => {
    console.log('west');
    this.direction = 'WEST';
    this.slice = 0;
    this.setDirection({x:0,y:-Math.PI/2,z:0}, {x:0,y:0,z:0});
  };

  south = () => {
    console.log('south');
    this.direction = 'SOUTH';
    this.slice = 0;
    this.setDirection({x:0,y:-Math.PI,z:0}, {x:(this.size-1)*this.r,y:0,z:0});
  };

  east = () => {
    console.log('east');
    this.direction = 'EAST';
    this.slice = this.size-1;
    this.setDirection({x:0,y:Math.PI/2,z:0}, {x:(this.size-1)*this.r,y:0,z:(this.size-1)*this.r});
  };

  top = () => {
    console.log('top');
    this.direction = 'TOP';
    this.slice = this.designModel.yMax-1;
    this.setDirection({x:-Math.PI/2,y:0,z:0}, {x:0,y:this.size*this.r,z:(this.size-1)*this.r});
  };

  bottom = () => {
    console.log('bottom');
    this.direction = 'BOTTOM';
    this.slice = 0;
    this.setDirection({x:Math.PI/2,y:0,z:0}, {x:0,y:0,z:0});
  };

  addObjectsToScene = () => {
    console.log('slice: ' + this.slice);
    this.designModel.objects.forEach((object, i) => {
      const position = this.designModel.getPosition(i);
      let renderType = null;
      switch(this.direction) {
        case 'NORTH':
          if (position.z === this.slice) {
            renderType = 'IN_SLICE';
          } else if (position.z < this.slice) {
            renderType = 'BEHIND';
          }
          break;
        case 'EAST':
          if (position.x === this.slice) {
            renderType = 'IN_SLICE';
          } else if (position.x < this.slice) {
            renderType = 'BEHIND';
          }
          break;
        case 'SOUTH':
          if (position.z === this.slice) {
            renderType = 'IN_SLICE';
          } else if (position.z > this.slice) {
            renderType = 'BEHIND';
          }
          break;
        case 'WEST':
          if (position.x === this.slice) {
            renderType = 'IN_SLICE';
          } else if (position.x > this.slice) {
            renderType = 'BEHIND';
          }
          break;
        case 'TOP':
          if (position.y === this.slice) {
            renderType = 'IN_SLICE';
          } else if (position.y < this.slice) {
            renderType = 'BEHIND';
          }
          break;
        case 'BOTTOM':
          if (position.y === this.slice) {
            renderType = 'IN_SLICE';
          } else if (position.y > this.slice) {
            renderType = 'BEHIND';
          }
          break;
        default:
          break;
      }

      switch(object) {
        case ObjectsEnum.CUBE:
          this.addCubeToScene(position, renderType);
          break;
        case ObjectsEnum.TREE:
          //
          break;
        default:
          // do nothing
      }
    });
  };

  addCubeToScene = (position, renderType) => {
    if (renderType) {
      const geometry = new THREE.PlaneGeometry( this.r, this.r, 1 );
      const wireframe = new THREE.EdgesGeometry( geometry );
      let material;
      if (renderType === 'IN_SLICE') {
        material = new THREE.LineBasicMaterial( { color: 0xffffff } );
      } else {
        console.log('dash');
        material = new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 8, gapSize: 8 } );
      }
      
      const line = new THREE.LineSegments( wireframe, material );

      switch(this.direction) {
        case 'NORTH':
        case 'SOUTH':
          break;
        case 'WEST':
        case 'EAST':
          line.rotation.y = Math.PI/2;
        case 'TOP':
        case 'BOTTOM':
          line.rotation.x = Math.PI/2;
          break;
      }

      line.computeLineDistances();
      line.position.x = position.x*this.r;
      line.position.y = position.y*this.r;
      line.position.z = position.z*this.r;
      this.scene.add( line );
    }
  };

  addPointsGridToScene = () => {
    var material = new THREE.PointsMaterial( { color: 0xffffff } );
    material.size = 3;
    var geometry = new THREE.Geometry();
    const xMax = this.designModel.xMax;
    const yMax = this.designModel.yMax;
    const zMax = this.designModel.zMax;

    for (let x = 0; x < xMax; x++) {
      for (let y = 0; y < yMax; y++) {
        for (let z = 0; z < zMax; z++) {
          geometry.vertices.push(new THREE.Vector3( x*this.r, y*this.r, z*this.r) );
        } 
      }
    }

    var points = new THREE.Points( geometry, material );
    this.scene.add( points );
  };

  addTopoToScene = () => {
    var material = new THREE.LineBasicMaterial( { color: 0xffffff } );
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( -this.r/2, -this.r/2, this.r*16.5) );
    geometry.vertices.push(new THREE.Vector3( this.r*17.5, -this.r/2, this.r*16.5) );
    var line = new THREE.Line( geometry, material );
    this.scene.add( line );
  };

  setDirection = (rotation, position) => {
    this.camera.position.x = position.x;
    this.camera.position.y = position.y;
    this.camera.position.z = position.z;
    this.camera.rotation.x = rotation.x;
    this.camera.rotation.y = rotation.y;
    this.camera.rotation.z = rotation.z;
    this.updateScene();
  };
  
}