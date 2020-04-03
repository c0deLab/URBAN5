/*
  Use this file to map the control pad wiring to the functions of this program

  This map shows the ids of the actions associated with each key on the control pad:
       0   1   2   3
   4   5   6   7   8    9
   9   10  11  12  13   14
       14  15  16  17

  The control pad should fire a given index for each of its keys. We want to map
  from the key id to the id of the action.

  For example, if the top left button fires '7', we map '7: 0', '7' is the number
  fired by the control pad, and '0' is the id of the action we want.
 */

// Current mapping
//     1  0  2  3
//  4  5  6  n  n  n
//  9  8  7  n  n  n
//     10 n  11 n
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
