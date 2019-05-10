import Cube from '../data/Cube';
import { Trunk, Foliage } from '../data/Tree';
import Roof from '../data/Roof';

// Mapping of class type to name for serialization across browsers after mangling of class names
const TypeToConstructorEnum = Object.freeze({
  CUBE: Cube,
  TRUNK: Trunk,
  FOLIAGE: Foliage,
  ROOF: Roof,
});
export default TypeToConstructorEnum;
