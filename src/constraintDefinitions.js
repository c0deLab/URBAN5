/*
  Use this file to adjust what input text matches which constraints.

  We choose if the text matches any constraint by looking for keywords that correspond
  to the given constraint. Then, the first number in the sentence is extracted and used as the value.

  'ambiguousKeywords' allows us to be more generous about matching, even if we are less sure.
  They are applied after the first pass looking for keywords that we are more confident about.
 */

const constraintDefinitions = [
  {
    name: 'MAX_HEIGHT',
    defaultConstraint: { fn: 'MAX', type: 'Structure', prop: 'height', comp: '<=', result: true },
    keywords: [ // definite matches to this constraint
      'tall', 'height', 'elevation', 'taller', 'shorter', 'above', 'altitude'
    ],
    ambiguousKeywords: [ // words to match if no definite matches found
      'bigger', 'larger', 'more', 'exceeding', 'in excess of', 'less'
    ]
  },
  {
    name: 'MAX_AREA',
    defaultConstraint: { fn: 'MAX', type: 'Structure', prop: 'area', comp: '<=', result: true },
    keywords: [
      'area', 'wide', 'covering', 'square', 'sq'
    ],
    ambiguousKeywords: []
  },
  {
    name: 'MAX_DIST_TO_ACCESS',
    defaultConstraint: { fn: 'MAX', type: '0', prop: 'distToAccess', comp: '<=', result: true },
    keywords: [
      'further', 'farther', 'from', 'distance', 'dist', 'access', 'door', 'exit', 'outside', 'escape'
    ],
    ambiguousKeywords: [
      'beyond'
    ]
  }
];

export default constraintDefinitions;
