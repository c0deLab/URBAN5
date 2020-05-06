/*
  Use this file to map the control pad wiring to the functions of the program.

  To do this, plug in the control pad and test out the buttons. Open the browser's console
  under the menu: View -> Developer -> JavaScript Console. Then, observe the logs for:
  'Control Pad Key: ${i}' to see which control pad keys map to which values.

  Then, update 'controlPadMapping' to map the control pad value to the action id.

  If more actions are needed, update the handleActions() function in src/ui/components/Main.js.
 */

// Action ids:
// 0: TOPO
// 1: DRAW
// 2: SURF
// 3: CALC (circulation)
// 4: MENU ITEM 1
// 5: MENU ITEM 2
// 6: MENU ITEM 3
// 10: MENU ITEM 4
// 11: MENU ITEM 5
// 12: MENU ITEM 6
// 16: START
// 17: RESTA.
// 18: STORE (Save)
// 19: PANIC

// first value is the value from the control pad ('Control Pad Key: ${i}') and
// the second value is the id of the action from the list above.
const controlPadMapping = {
  1: 0,
  0: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  9: 10,
  8: 11,
  7: 12,
  10: 16,
  11: 18
};

export default controlPadMapping;
