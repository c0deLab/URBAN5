import ActionsEnum from './ActionsEnum';

// Buttons pair a label which is 8 chars of fixed-width to an action
const ButtonsEnum = {
  STEPOUT: { label: 'STEP OUT', action: ActionsEnum.STEPOUT },
  STEPIN: { label: 'STEP  IN', action: ActionsEnum.STEPIN },
  ADDCUBE: { label: 'ADD CUBE', action: ActionsEnum.ADDCUBE },
  REMOVE: { label: 'RE  MOVE', action: ActionsEnum.REMOVE },
  ROTATELT: { label: 'ROTATELT', action: ActionsEnum.ROTATELT },
  ROTATERT: { label: 'ROTATERT', action: ActionsEnum.ROTATERT },
  ADDTREE: { label: 'ADD TREE', action: ActionsEnum.ADDTREE },
  ADDRFLFT: { label: 'ADDRFLFT', action: ActionsEnum.ADDRFLFT },
  ADDRFRGT: { label: 'ADDRFRGT', action: ActionsEnum.ADDRFRGT },
  WALKTHRU: { label: 'WALKTHRU', action: ActionsEnum.WALKTHRU },
  EDITTOPO: { label: 'EDITTOPO', action: ActionsEnum.EDITTOPO },
};

export default ButtonsEnum;
