import ObjectsEnum from './ObjectsEnum';

export default class DesignModel {

  constructor(xMax, yMax, zMax) {
    this.xMax = xMax;
    this.yMax = yMax;
    this.zMax = zMax;

    this.objects = this.initObjects();
    this.topo = this.initTopo();

    this.addObject({x:0, y:0, z:0}, 'CUBE');
    this.addObject({x:16, y:0, z:0}, 'CUBE');
    this.addObject({x:0, y:6, z:0}, 'CUBE');
    this.addObject({x:16, y:6, z:0}, 'CUBE');
    this.addObject({x:16, y:6, z:16}, 'CUBE');
    this.addObject({x:0, y:6, z:16}, 'CUBE');
    this.addObject({x:0, y:0, z:16}, 'CUBE');
    this.addObject({x:16, y:0, z:16}, 'CUBE');
    this.addObject({x:6, y:3, z:7}, 'CUBE');
    this.addObject({x:4, y:4, z:5}, 'CUBE');
    //this.addObject({x:0, y:0, z:0}, 'CUBE');
  }

  initObjects = () => {
    let objects = new Array(this.xMax*this.yMax*this.zMax);

    for (var i = 0; i < objects.length; i++) {
      objects[i] = null;
    }

    return objects;
  };

  initTopo = () => {
    let topo = new Array(this.xMax*this.zMax);

    for (var i = 0; i < topo.length; i++) {
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

  addObject = (position, type) => {
    const i = this.getIndexFromPosition(position);
    const object = ObjectsEnum[type];
    this.objects[i] = object;
  };

  setHeight = (position, height) => {
    this.topo[position.x][position.z] = height;
  };
}
