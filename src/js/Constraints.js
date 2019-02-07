
export default class Constraints {
  constructor() {
    //
  }

  // This class can take text inputs for constraints and create rules which can be applied
  // to model

  // For example: max height, number of objects, cantilever
  //light, blocking entrances, check access

  // "The max height shall be no more than 30 ft high"

  // natural language processing:
  // "max height", "maximum height",  -> MAX_HEIGHT
  // "no more than", "no greater than", "no taller than", "less than or equal to" -> <=
  // "30 ft", "# ft" -> #/10 compare to objects
  // "trees", only trees, cubes, only cubes, roofs, only roofs


  // mimic parsing tree from documentation
}
