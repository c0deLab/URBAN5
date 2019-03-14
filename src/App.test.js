import React from 'react';
import ReactDOM from 'react-dom';

import Constraint from './js/sessionAPI/Constraint';

const compareConstraints = (textInputs, expected) => {
  textInputs.forEach(text => {
    const actual = Constraint.parseText(text);
    console.log(actual);
    expect(actual.result).toEqual(expected.result);
    expect(actual.fn).toEqual(expected.fn);
    expect(JSON.stringify(actual.type)).toEqual(JSON.stringify(expected.type));
    expect(actual.prop).toEqual(expected.prop);
    expect(actual.comp).toEqual(expected.comp);
    expect(actual.value).toEqual(expected.value);
  });
};

it('No building taller than 50 ft', () => {
  const c = ['No building taller than 50 ft'];
  const e = { 'result': true, 'fn': 'SUM', 'type': 'building', 'prop': 'height', 'comp': '===', 'value': '50' };
  compareConstraints(c, e);
});

it('No roof should be without a base', () => {
  const c = [
    'No roof should be without a base',
    'There should be no roof without a cube underneath',
    'Every roof should have a building attached',
    'All roofs must have something below it'
  ];
  const e = { 'result': false, 'fn': 'SUM', 'type': [1], 'prop': 'noBase', 'comp': '>', 'value': 0 };
  compareConstraints(c, e);
});

it('No building should be below ground', () => {
  const c = [
    'No building should be below ground',
    'All buildings should be above ground',
  ];
  const e = { 'result': false, 'fn': 'MIN', 'type': 'building', 'prop': 'ground', 'comp': '<', 'value': 0 };
  compareConstraints(c, e);
});

it('No cube or roof should be below ground', () => {
  const c = [
    'No cube or roof should be below ground',
    'All cubes and roofs should be above ground'
  ];
  const e = { 'result': false, 'fn': 'MIN', 'type': [0, 1], 'prop': 'ground', 'comp': '<', 'value': 0 };
  compareConstraints(c, e);
});

it('The maximum height for buildings is 50ft', () => {
  const c = [
    'The maximum height for buildings is 50ft',
    'No building should be above 50 ft',
    'All buildings should be 50 ft or less',
    'Not part of the project should exceed 5 floors.',
    'The maximum height is 5 floors.'
  ];
  const e = { 'result': true, 'fn': 'MAX', 'type': 'building', 'prop': 'height', 'comp': '<=', 'value': '50' };
  compareConstraints(c, e);
});

it('No roof should be above 40ft', () => {
  const c = [
    'No roof should be above 40ft'
  ];
  const e = { 'result': false, 'fn': 'MAX', 'type': [1], 'prop': 'height', 'comp': '>', 'value': 40 };
  compareConstraints(c, e);
});

it('All roofs must be under 50ft', () => {
  const c = [
    'All roofs must be under 50ft'
  ];
  const e = { 'result': false, 'fn': 'MAX', 'type': [1], 'prop': 'height', 'comp': '<', 'value': 50 };
  compareConstraints(c, e);
});

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
