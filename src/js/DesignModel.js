import ObjectsEnum from './ObjectsEnum';
import ViewsEnum from './ViewsEnum';

export default class DesignModel {

  constructor(xMax, yMax, zMax) {
    this.xMax = xMax;
    this.yMax = yMax;
    this.zMax = zMax;

    this.objects = this.initObjects();
    this.topo = this.initTopo();

    // this.addObject({x:0, y:0, z:0}, ObjectsEnum.CUBE);
    // this.addObject({x:16, y:0, z:0}, ObjectsEnum.CUBE);
    // this.addObject({x:0, y:6, z:0}, ObjectsEnum.CUBE);
    // this.addObject({x:16, y:6, z:0}, ObjectsEnum.CUBE);
    // this.addObject({x:16, y:6, z:16}, ObjectsEnum.CUBE);
    // this.addObject({x:0, y:6, z:16}, ObjectsEnum.CUBE);
    // this.addObject({x:0, y:0, z:16}, ObjectsEnum.CUBE);
    // this.addObject({x:16, y:0, z:16}, ObjectsEnum.CUBE);
    // this.addObject({x:2, y:2, z:7}, ObjectsEnum.CUBE);
    // this.addObject({x:3, y:3, z:5}, ObjectsEnum.CUBE);

    this.addObject({x:0, y:0, z:0}, ObjectsEnum.CUBE);
    this.addObject({x:1, y:0, z:0}, ObjectsEnum.CUBE);
    this.addObject({x:2, y:0, z:0}, ObjectsEnum.CUBE);
    this.addObject({x:2, y:1, z:0}, ObjectsEnum.CUBE);
    this.addObject({x:1, y:0, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:2, y:0, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:1, y:1, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:2, y:1, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:1, y:2, z:1}, ObjectsEnum.CUBE);

    this.addObject({x:5, y:0, z:0}, ObjectsEnum.CUBE);
    this.addObject({x:6, y:0, z:0}, ObjectsEnum.CUBE);
    this.addObject({x:7, y:0, z:0}, ObjectsEnum.CUBE);
    this.addObject({x:8, y:0, z:0}, ObjectsEnum.CUBE);
    this.addObject({x:5, y:0, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:6, y:0, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:7, y:0, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:8, y:0, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:5, y:1, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:6, y:1, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:8, y:1, z:1}, ObjectsEnum.CUBE);
    this.addObject({x:6, y:0, z:2}, ObjectsEnum.CUBE);
    this.addObject({x:7, y:0, z:2}, ObjectsEnum.CUBE);
    this.addObject({x:8, y:0, z:2}, ObjectsEnum.CUBE);
    this.addObject({x:9, y:0, z:2}, ObjectsEnum.CUBE);

    // this.addObject({x:3, y:0, z:0}, ObjectsEnum.TRUNK);
    // this.addObject({x:3, y:1, z:0}, ObjectsEnum.FOLIAGE);
  }

  initObjects = () => {
    let objects = new Array(this.xMax*this.yMax*this.zMax);

    for (let i = 0; i < objects.length; i++) {
      objects[i] = null;
    }

    return objects;
  };

  initTopo = () => {
    let topo = new Array(this.xMax*this.zMax);

    for (let i = 0; i < topo.length; i++) {
      topo[i] = 0;
    }

    return topo;
  };

  getPosition = (i) => {
    const x = Math.floor(i/(this.zMax*this.yMax));
    const xRemainder = i % (this.zMax*this.yMax);
    const y = Math.floor(xRemainder/this.zMax);
    const z = i % this.zMax;

    return {x:x, y:y, z:z};
  };

  getIndexFromPosition = (position) => {
    return (position.x*this.yMax*this.zMax) + (position.y*this.zMax) + position.z;
  };
  
  // Returns 2D array of objects in slice
  getSlice = (view, slice) => {
    const sliceObjects = this.getEmptySliceArray(view, slice);

    this.objects.forEach((object, i) => {
      const position = this.getPosition(i);

      // if (object === null) {
      //   return;
      // }

      switch(view) {
        case ViewsEnum.SOUTH:
          if (position.z === slice) {
            sliceObjects[position.x][position.y] = object;
          }
          break;
        case ViewsEnum.NORTH:
          if (position.z === (this.zMax - 1 - slice)) {
            sliceObjects[this.xMax-1-position.x][position.y] = object;
          }
          break;
        case ViewsEnum.WEST:
          if (position.x === slice) {
            sliceObjects[position.z][position.y] = object;
          }
          break;
        case ViewsEnum.EAST:
          if (position.x === (this.xMax - 1 - slice)) {
            sliceObjects[this.zMax-1-position.z][position.y] = object;
          }
          break;
        case ViewsEnum.BOTTOM:
          if (position.y === slice) {
            sliceObjects[position.x][this.zMax-1-position.z] = object;
          }
          break;
        case ViewsEnum.TOP:
          if (position.y === (this.yMax - 1 - slice)) {
            sliceObjects[position.x][position.z] = object;
          }
          break;
        default:
          throw new Error('view "' + view + '" is not recognized!');
      }
    });

    return sliceObjects;
  };

  // Returns 2D array of objects behind slice
  getBackgroundSlice = (view, slice) => {
    const sliceObjects = this.getEmptySliceArray(view, slice);

    this.objects.forEach((object, i) => {
      const position = this.getPosition(i);

      if (object === ObjectsEnum.CUBE) {
        switch(view) {
          case ViewsEnum.SOUTH:
            if (position.z > slice) {
              sliceObjects[position.x][position.y] = object;
            }
            break;
          case ViewsEnum.NORTH:
            if (position.z < (this.zMax - 1 - slice)) {
              sliceObjects[this.xMax-1-position.x][position.y] = object;
            }
            break;
          case ViewsEnum.WEST:
            if (position.x > slice) {
              sliceObjects[position.z][position.y] = object;
            }
            break;
          case ViewsEnum.EAST:
            if (position.x < (this.xMax - 1 - slice)) {
              sliceObjects[this.zMax-1-position.z][position.y] = object;
            }
            break;
          case ViewsEnum.BOTTOM:
            if (position.y > slice) {
              sliceObjects[position.x][this.zMax-1-position.z] = object;
            }
            break;
          case ViewsEnum.TOP:
            if (position.y < (this.yMax - 1 - slice)) {
              sliceObjects[position.x][position.z] = object;
            }
            break;
          default:
            throw new Error('view "' + view + '" is not recognized!');
        }
      }
    });

    return sliceObjects;
  };

  getEmptySliceArray = (view, slice) => {
    let columns;
    let rows;

    switch(view) {
      case ViewsEnum.NORTH:
      case ViewsEnum.SOUTH:
        columns = this.xMax;
        rows = this.yMax;
        break;
      case ViewsEnum.WEST:
      case ViewsEnum.EAST:
        columns = this.zMax;
        rows = this.yMax;
        break;
      case ViewsEnum.TOP:
      case ViewsEnum.BOTTOM:
        columns = this.xMax;
        rows = this.zMax;
        break;
      default:
        throw new Error('view "' + view + '" is not recognized!');
    }
    // Make empty array
    const sliceArr = this.getEmpty2DArray(rows, columns);
    return sliceArr;
  };

  getEmpty2DArray = (rows, columns) => {
    const arr = new Array(columns);
    for (let i = 0; i < columns; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
  };

  addObject = (position, object) => {
    const i = this.getIndexFromPosition(position);
    this.objects[i] = object;
  };

  removeObject = (position) => {
    const i = this.getIndexFromPosition(position);
    this.objects[i] = null;
  };

  setHeight = (position, height) => {
    this.topo[position.x][position.z] = height;
  };
}
