import Cube from '../sessionAPI/Cube';
import { Trunk, Foliage } from '../sessionAPI/Tree';
import Roof from '../sessionAPI/Roof';

// Mapping of class type to name for serialization across browsers after mangling of class names
const TypeToConstructorEnum = Object.freeze({
  CUBE: Cube,
  TRUNK: Trunk,
  FOLIAGE: Foliage,
  ROOF: Roof,
});
export default TypeToConstructorEnum;
