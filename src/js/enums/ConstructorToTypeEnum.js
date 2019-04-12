import Cube from '../sessionAPI/Cube';
import { Trunk, Foliage } from '../sessionAPI/Tree';
import Roof from '../sessionAPI/Roof';

// Mapping of class type to name for serialization across browsers after mangling of class names
const ConstructorToTypeEnum = Object.freeze({
  [Cube.name]: 'CUBE',
  [Trunk.name]: 'TRUNK',
  [Foliage.name]: 'FOLIAGE',
  [Roof.name]: 'ROOF',
});
export default ConstructorToTypeEnum;
