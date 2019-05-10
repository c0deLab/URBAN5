const ActionsEnum = {
  STEPOUT: { id: 0, label: 'STEP OUT' }, // Retreat to the previous slice
  STEPIN: { id: 1, label: 'STEP  IN' }, // Advance to the next slice
  ADDCUBE: { id: 2, label: 'ADD CUBE' }, // Add a cube
  REMOVE: { id: 3, label: 'DELETE' }, // Remove an object
  ROTATELT: { id: 4, label: 'LOOKLEFT' }, // Rotate the view to the right
  ROTATERT: { id: 5, label: 'LOOKRGHT' }, // Rotate the view to the left
  ADDTREE: { id: 6, label: 'ADD TREE' }, // Add a Tree (trunk and foliage)
  ADD_ROOF_NORTH: { id: 7, label: 'ADDROOFN' }, // Add Angled Roof down towards north
  ADD_ROOF_SOUTH: { id: 8, label: 'ADDROOFS' }, // Add Angled Roof down towards south
  WALKTHRU: { id: 9, label: 'WALKTHRU' }, // Start walkthrough
  // EDITTOPO: { id: 10, label: 'EDITTOPO' }, // Edit topo mode
  SPEAK_CONSTRAINT: { id: 11, label: 'CONSTRNT' }, // Enter text constraint
  INCREASE_HEIGHT: { id: 12, label: 'INCRS HT' },
  DECREASE_HEIGHT: { id: 13, label: 'DECRS HT' },
  SOLID_SURFACE: { id: 14, label: 'SOLIDSRF' },
  PARTITION_SURFACE: { id: 15, label: 'PARTTION' },
  TRANSPARENT_SURFACE: { id: 16, label: 'TRANSPNT' },
  NO_SURFACE: { id: 17, label: 'NO SRF' },
  HAS_ACCESS: { id: 18, label: 'HASACCSS' },
  NO_ACCESS: { id: 19, label: 'NO ACCSS' },
  ADD_ROOF_WEST: { id: 20, label: 'ADDROOFW' }, // Add Angled Roof down towards west
  ADD_ROOF_EAST: { id: 21, label: 'ADDROOFE' }, // Add Angled Roof down towards east
  ADDROOF: { id: 22, label: 'ADD ROOF' }, // Add Roof, click rotates

  isAdd: action => [2, 6, 7, 8, 20, 21].includes(action.id),
};

export default ActionsEnum;
