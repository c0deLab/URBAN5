const ActionsEnum = {
  STEPOUT: { id: 0, label: 'STEP OUT' }, // Retreat to the previous slice
  STEPIN: { id: 1, label: 'STEP  IN' }, // Advance to the next slice
  ADDCUBE: { id: 2, label: 'ADD CUBE' }, // Add a cube
  REMOVE: { id: 3, label: 'RE  MOVE' }, // Remove an object
  ROTATELT: { id: 4, label: 'ROTATELT' }, // Rotate the view to the right
  ROTATERT: { id: 5, label: 'ROTATERT' }, // Rotate the view to the left
  ADDTREE: { id: 6, label: 'ADD TREE' }, // Add a Tree (trunk and foliage)
  ADDRFLFT: { id: 7, label: 'ADDRFLFT' }, // Add Left Angle Roof
  ADDRFRGT: { id: 8, label: 'ADDRFRGT' }, // Add Right Angle Roof
  WALKTHRU: { id: 9, label: 'WALKTHRU' }, // Start walkthrough
  EDITTOPO: { id: 10, label: 'EDITTOPO' }, // Edit topo mode

  isAdd: action => [2, 6, 7, 8].includes(action.id),
};

export default ActionsEnum;
