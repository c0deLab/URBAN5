import parseText from './js/helpers/TextToConstraint';

const compareConstraints = (text, expected) => {
  const actual = parseText(text);
  console.log(actual);
  expect(actual.result).toEqual(expected.result);
  expect(actual.fn).toEqual(expected.fn);
  expect(JSON.stringify(actual.type)).toEqual(JSON.stringify(expected.type));
  expect(actual.prop).toEqual(expected.prop);
  expect(actual.comp).toEqual(expected.comp);
  expect(actual.value).toEqual(expected.value);
};

const testMaps = [
  {
    result: { result: true, fn: 'MAX', type: 'Structure', prop: 'height', comp: '<=', value: '50' },
    texts: [
      'The maximum height for buildings is 50ft tall'
    ]
  },
  {
    result: { result: false, fn: 'MAX', type: 'Structure', prop: 'height', comp: '>', value: '50' },
    texts: [
      'There should not be any building taller than 50 ft',
      'There should not be any structure with a height more than 50 feet',
      'No building should be above 50 ft tall',
      'There shouldn\'t be any building taller than 50 ft',
      'There should not be any building taller than 50 feet',
      'There should not be any building bigger than 50 feet tall',
      'There should not be any building greater than 50 feet tall',
      'There should not be any building larger than 50 feet tall',
      'There should not be any structure with a height more than 50 feet',
      'There should not be any structure with a height greater than 50 feet',
      'There should not be any structure with a height bigger than 50 feet'
    ]
  },
  {
    result: { result: false, fn: 'MIN', type: 'Structure', prop: 'height', comp: '<', value: '50' },
    texts: [
      'There should not be any building smaller than 50 feet tall',
      'There should not be any building shorter than 50 feet',
      'There should not be any structure with a height fewer than 50 feet tall',
      'There should not be any structure with a height smaller than 50 feet tall',
      'There should not be any structure with a height shorter than 50 feet in height',
      'There should not be any structure with a height less than 50 feet in height',
      'No building should be smaller than 50 feet tall',
      'None of the buildings should be smaller than 50 feet tall',
      'There shouldn\'t be buildings shorter than 50 feet tall',
    ]
  },
  {
    result: { result: true, fn: 'MAX', type: 'Structure', prop: 'height', comp: '<', value: '50' },
    texts: [
      'All buildings should be smaller than 50 feet tall',
      'Buildings should be smaller than 50 feet tall',
      'Every building should be smaller than 50 feet tall',
      'Each building should be smaller than 50 feet tall',
    ]
  },
  {
    result: { result: true, fn: 'MIN', type: 'Structure', prop: 'height', comp: '>=', value: '50' },
    texts: [
      'The minimum height for structures is 50ft tall'
    ]
  },
  {
    result: { result: true, fn: 'MAX', type: 'Structure', prop: 'area', comp: '<', value: '500' },
    texts: [
      'The total area of the building should be less than 500 sqft'
    ]
  },
  {
    result: { result: true, fn: 'MAX', type: '0', prop: 'distToAccess', comp: '<=', value: '30' },
    texts: [
      'The maximum distance to access should be 30 ft',
    ]
  },
  {
    result: { result: true, fn: 'MAX', type: '0', prop: 'distToAccess', comp: '<', value: '20' },
    texts: [
      'The distance to access for each cube should be less than 20 ft',
    ]
  },
  {
    result: { result: false, fn: 'MAX', type: '0', prop: 'distToAccess', comp: '>', value: '40' },
    texts: [
      'No cube should be more than 40 ft from access',
      'No room should be more than 40 ft from access',
      'No area should be more than 40 ft from access',
    ]
  },
  {
    result: { result: false, fn: 'MAX', type: 'Structure', prop: 'area', comp: '>', value: '2000' },
    texts: [
      'The total area of buildings shouldn\'t be more than 2000 sqft',
    ]
  },
];

testMaps.forEach(testMap => {
  const { result, texts } = testMap;
  texts.forEach(text => {
    it(text, () => {
      return compareConstraints(text, result);
    });
  });
});








// it('All buildings should be 50 ft or less', () => {
//   const c = [
//     'All buildings should be 50 ft or less',
//     'No part of the project should exceed 5 floors.',
//     'The maximum height is 5 floors.'
//   ];
//   const e = { 'result': false, 'fn': 'MAX', 'type': 'Structure', 'prop': 'height', 'comp': '===', 'value': '50' };
//   compareConstraints(c, e);
// });

// it('No roof should be without a base', () => {
//   const c = [
//     'No roof should be without a base',
//     'There should be no roof without a cube underneath',
//     'Every roof should have a building attached',
//     'All roofs must have something below it'
//   ];
//   const e = { 'result': false, 'fn': 'SUM', 'type': 'Roof', 'prop': 'noBase', 'comp': '>', 'value': 0 };
//   compareConstraints(c, e);
// });

// it('No building should be below ground', () => {
//   const c = [
//     'No building should be below ground',
//     'All buildings should be above ground',
//   ];
//   const e = { 'result': false, 'fn': 'MIN', 'type': 'building', 'prop': 'ground', 'comp': '<', 'value': 0 };
//   compareConstraints(c, e);
// });

// it('No cube or roof should be below ground', () => {
//   const c = [
//     'No cube or roof should be below ground',
//     'All cubes and roofs should be above ground'
//   ];
//   const e = { 'result': false, 'fn': 'MIN', 'type': [0, 1], 'prop': 'ground', 'comp': '<', 'value': 0 };
//   compareConstraints(c, e);
// });

// it('No roof should be above 40ft', () => {
//   const c = [
//     'No roof should be above 40ft'
//   ];
//   const e = { 'result': false, 'fn': 'MAX', 'type': [1], 'prop': 'height', 'comp': '>', 'value': 40 };
//   compareConstraints(c, e);
// });

// it('All roofs must be under 50ft', () => {
//   const c = [
//     'All roofs must be under 50ft'
//   ];
//   const e = { 'result': false, 'fn': 'MAX', 'type': [1], 'prop': 'height', 'comp': '<', 'value': 50 };
//   compareConstraints(c, e);
// });

// it('There should be no more than 4 buildings.', () => {
//   const c = [
//     'There should be no more than 4 buildings.'
//   ];
//   const e = {};
//   compareConstraints(c, e);
// });

// it('There needs to be one tree for every 500 sq ft.', () => {
//   const c = [
//     'There needs to be one tree for every 500 sq ft.'
//   ];
//   const e = {};
//   compareConstraints(c, e);
// });

// it('There needs to be one tree for every building.', () => {
//   const c = [
//     'There needs to be one tree for every building.'
//   ];
//   const e = {};
//   compareConstraints(c, e);
// });

// it('No part of the building should be further than 100 ft from an exit.', () => {
//   const c = [
//     'No part of the building should be further than 100 ft from an exit.'
//   ];
//   const e = {};
//   compareConstraints(c, e);
// });
