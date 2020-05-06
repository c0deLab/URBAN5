import Cube from '../Cube';
import { Trunk, Foliage } from '../Tree';
import Roof from '../Roof';

// Mapping of class type to name for serialization across browsers after mangling of class names
// Used to allow saving the design to localStorage
const TypeToConstructorEnum = Object.freeze({
  CUBE: Cube,
  TRUNK: Trunk,
  FOLIAGE: Foliage,
  ROOF: Roof,
});
export default TypeToConstructorEnum;
