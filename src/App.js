import React, { Component } from 'react';
import MainPage from './components/MainPage';
import ActionsAPI from './js/ActionsAPI';
import Monitor from './js/Monitor';
import DesignModel from './js/DesignModel';
import './App.css';
import * as THREE from 'three';


// import ObjectsEnum from './js/enums/ObjectsEnum';
// import { getEmpty3DArray } from './js/ArrayHelpers';

// import Cube from './js/Cube';
// import Roof from './js/Roof';
// import { Trunk, Foliage } from './js/Tree';

/* global window */
/* global localStorage */

const SETTINGS = {
  w: 852,
  h: 852,
  color: '#E8E8DA',
  gridSize: 17,
  xMax: 17,
  yMax: 17,
  zMax: 7,
  r: 50,
  material: new THREE.LineBasicMaterial({ color: 0xE8E8DA }),
  stroke: 3.5
};
window.SETTINGS = SETTINGS;

// let designModel;

// const serializeObj = obj => {
//   let toSave;

//   if (obj) {
//     if (obj.constructor.name === 'Cube') {
//       toSave = {
//         type: ObjectsEnum.CUBE,
//         position: obj.position,
//         surfaces: obj.surfaces
//       };
//     } else if (obj.constructor.name === 'Trunk') {
//       toSave = {
//         type: ObjectsEnum.TREE,
//         position: obj.position
//       };
//     } else if (obj.constructor.name === 'Foliage') {
//       toSave = {
//         type: ObjectsEnum.FOLIAGE,
//         position: obj.position
//       };
//     } else if (obj.constructor.name === 'Roof') {
//       toSave = {
//         type: ObjectsEnum.ROOF,
//         position: obj.position,
//         direction: obj.surfaces,
//         hasSideSurface: obj.hasSideSurface
//       };
//     }
//   }

//   return toSave;
// };

// const deserializeObj = obj => {
//   let newObj = null;
//   if (obj) {
//     if (obj.type === ObjectsEnum.CUBE) {
//       newObj = new Cube();
//       newObj.position = obj.position;
//       newObj.surfaces = obj.surfaces;
//     } else if (obj.type === ObjectsEnum.TRUNK) {
//       newObj = new Trunk();
//       newObj.position = obj.position;
//     } else if (obj.type === ObjectsEnum.FOLIAGE) {
//       newObj = new Foliage();
//       newObj.position = obj.position;
//     } else if (obj.type === ObjectsEnum.ROOF) {
//       newObj = new Roof();
//       newObj.position = obj.position;
//       newObj.direction = obj.direction;
//       newObj.hasSideSurface = obj.hasSideSurface;
//     }
//   }
//   return newObj;
// };


// function saveModel() {
//   const saveArray = getEmpty3DArray(SETTINGS.xMax, SETTINGS.yMax, SETTINGS.zMax);
//   const { objects } = designModel;
//   for (let z = 0; z < SETTINGS.zMax; z += 1) {
//     for (let y = 0; y < SETTINGS.xMax; y += 1) {
//       for (let x = 0; x < SETTINGS.yMax; x += 1) {
//         const obj = objects[z][y][x];
//         if (obj !== null) {
//           saveArray[z][y][x] = serializeObj(obj);
//         }
//       }
//     }
//   }
//   const model = {
//     objects: saveArray,
//     topo: {
//       heights: designModel.topo.heights
//     }
//   };
//   localStorage.setItem('designModel', JSON.stringify(model));
// }

// function loadModel() {
//   const model = JSON.parse(localStorage.getItem('designModel'));

//   const loadArray = getEmpty3DArray(SETTINGS.xMax, SETTINGS.yMax, SETTINGS.zMax);
//   const { objects } = model;
//   for (let z = 0; z < SETTINGS.zMax; z += 1) {
//     for (let y = 0; y < SETTINGS.xMax; y += 1) {
//       for (let x = 0; x < SETTINGS.yMax; x += 1) {
//         const obj = objects[z][y][x];
//         if (obj !== null) {
//           loadArray[z][y][x] = deserializeObj(obj);
//         }
//       }
//     }
//   }

//   model.objects = loadArray;

//   return model;
// }

// const savedModel = loadModel();
// console.log(savedModel);
// if (savedModel) {
//   designModel = new DesignModel(savedModel);
// } else {
//   designModel = new DesignModel();
// }
let designModel = new DesignModel();

const actionsAPI = new ActionsAPI();
const monitor = new Monitor(actionsAPI, designModel);

// actionsAPI.addListener({
//   onAction: saveModel
// });

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <MainPage actionsAPI={actionsAPI} monitor={monitor} designModel={designModel} />
      </div>
    );
  }
}
