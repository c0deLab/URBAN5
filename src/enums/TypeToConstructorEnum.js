import Cube from '../api/Cube';
import { Trunk, Foliage } from '../api/Tree';
import Roof from '../api/Roof';

// Mapping of class type to name for serialization across browsers after mangling of class names
const TypeToConstructorEnum = Object.freeze({
  CUBE: Cube,
  TRUNK: Trunk,
  FOLIAGE: Foliage,
  ROOF: Roof,
});
export default TypeToConstructorEnum;
