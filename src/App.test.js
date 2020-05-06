import { parseText } from './api/Constraint';

/* global expect */

// This test file contains test for various constraints
// It can be run with 'npm run test'

const compareConstraints = (text, expected) => {
  const actual = parseText(text);
  // console.log(actual);
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
      'All buildings should be smaller than 50 feet tall',
      'Buildings should be smaller than 50 feet tall',
      'Every building should be smaller than 50 feet tall',
      'Each building should be smaller than 50 feet tall',
      'The maximum height for buildings is 50ft tall',
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
      'There should not be any structure with a height bigger than 50 feet',
      'All buildings should be 50 ft or less',
    ]
  },
  {
    result: { result: true, fn: 'MAX', type: 'Structure', prop: 'area', comp: '<=', value: '500' },
    texts: [
      'The total area of the building should be less than 500 sqft',
      'The total area of buildings shouldn\'t be more than 500 sqft',
      'The total area of the building should be less than 500 square ft',
    ]
  },
  {
    result: { result: true, fn: 'MAX', type: '0', prop: 'distToAccess', comp: '<=', value: '30' },
    texts: [
      'The maximum distance to access should be 30 ft',
      'The distance to access for each cube should be less than 30 ft',
      'No cube should be more than 30 ft from access',
      'No room should be more than 30 ft from access',
      'No area should be more than 30 ft from access',
      'No room farther than 30 ft from access',
      'No part of the building should be further than 30 ft from an exit.'
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
