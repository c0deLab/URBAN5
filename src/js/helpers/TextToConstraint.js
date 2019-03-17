import nlp from 'compromise';

const plugin = {
  words: {
    'less than': 'Comparative',
    'fewer than': 'Comparative',
    'more than': 'Comparative',
    'greater than': 'Comparative',
    'building': 'Noun',
    'structure': 'Noun',
    'no': 'Expression'
  }
};
nlp.plugin(plugin);

// Replace problem words or for convenience
const REPLACE = {
  // result
  no: ['not', 'none'],
};

const TYPES = {
  Structure: ['structure', 'building', 'structures', 'buildings'],
  0: ['cube', 'room', 'area', 'cubes', 'rooms', 'areas'], // ObjectsEnum.CUBE
  1: ['roof', 'roofs', 'rooves'], // ObjectsEnum.ROOF
  2: ['tree', 'plant', 'bush', 'trees', 'plants', 'bushes'], // ObjectsEnum.TRUNK
};

const PROPS = {
  area: ['area', 'square footage', 'sf', 'space', 'floor', 'floorspace', 'size'],
  height: ['tall', 'height', 'elevation', 'taller', 'shorter'],
  distToAccess: ['access']
};

const COMPS = {
  '===': ['equals', 'same'],
  '>': ['greater', 'more', 'bigger', 'taller', 'larger', 'above'],
  '<': ['fewer', 'less', 'smaller', 'shorter', 'below'],
  '>=': ['minimum', 'min'],
  '<=': ['maximum', 'max'],
};

function reverseMap(map) {
  const reverse = {};
  Object.keys(map).forEach(key => {
    const synonyms = map[key];
    synonyms.forEach(synonym => {
      reverse[synonym] = key;
    });
  });
  return reverse;
}

// Create inverse map for look ups
const COMPS_REVERSE = reverseMap(COMPS);
const PROPS_REVERSE = reverseMap(PROPS);
const TYPES_REVERSE = reverseMap(TYPES);
const REPLACE_REVERSE = reverseMap(REPLACE);

// const FNS = {
//   // 'MAX': ['', 'same'],
//   // 'MIN': ['greater', 'more', 'bigger', 'taller', 'larger'],
//   SUM: ['total', 'any']
// };

function splitResults(results) {
  const trueResults = [];
  results.forEach(result => {
    trueResults.push(...result.normal.split(' '));
  });
  return trueResults;
}

// const STOP_WORDS = [
//   // source: https://nlp.stanford.edu/IR-book/html/htmledition/dropping-common-terms-stop-words-1.html
//   'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in',
//   'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will', 'with',
//   // others
//   'should', 'there'
// ];

const getResult = doc => !doc.has('no');

const getValue = doc => {
  const numbers = doc.values().numbers();
  let value = null;
  if (numbers.length > 0) {
    let i = 0;
    while (!numbers[i] && i < numbers.length - 1) {
      i += 1;
    }
    value = numbers[i].toString();
  }
  return value;
};

const getProp = doc => {
  // const nounParts = doc.nouns().data();

  // console.log('nounParts', nounParts);
  // let prop = null;
  // if (nounParts.length > 0) {
  //   const propKeys = Object.keys(PROPS_REVERSE);

  //   nounParts.forEach(nounPart => {
  //     const noun = nounPart.singular;
  //     if (propKeys.includes(noun)) {
  //       prop = PROPS_REVERSE[noun];
  //     }
  //   });
  // }

  // const compWords = doc.match('(#Comparative|#Adverb|#Adjective)').out('array');
  // if (compWords.length > 0) {
  //   const propKeys = Object.keys(PROPS_REVERSE);
  //   compWords.forEach(compWord => {
  //     console.log('compWord', compWord);
  //     if (propKeys.includes(compWord)) {
  //       prop = PROPS_REVERSE[compWord];
  //     }
  //   });
  // }

  let prop = null;
  const propKeys = Object.keys(PROPS_REVERSE);
  propKeys.forEach(key => {
    if (doc.has(key)) {
      prop = PROPS_REVERSE[key];
    }
  });

  return prop;
};

const getType = doc => {
  // const nounParts = doc.nouns().data();
  // let type = '0';
  // // split multipart nouns into parts
  // const nouns = splitResults(doc.nouns().data());
  // if (nouns.length > 0) {
  //   const typeKeys = Object.keys(TYPES_REVERSE);

  //   nouns.forEach(noun => {
  //     if (typeKeys.includes(noun)) {
  //       type = TYPES_REVERSE[noun];
  //     }
  //   });
  // }

  let type = '0';
  const propKeys = Object.keys(TYPES_REVERSE);
  propKeys.forEach(key => {
    if (doc.has(key)) {
      type = TYPES_REVERSE[key];
    }
  });
  return type;
};

const getComp = doc => {
  const compWords = doc.match('(#Comparative|#Adverb|#Adjective)').out('array');
  let comp = null;
  if (compWords.length > 0) {
    const compKeys = Object.keys(COMPS_REVERSE);
    compWords.forEach(compWord => {
      // console.log('compWord', compWord);
      if (compKeys.includes(compWord)) {
        // Map the comparator word to its comparator symbol
        comp = COMPS_REVERSE[compWord];
      }
    });
  }
  return comp;
};

const getFn = (result, comp) => {
  let fn = null;
  if (!result) {
    if (comp === '>' || comp === '>=') {
      fn = 'MAX';
    } else if (comp === '<' || comp === '<=') {
      fn = 'MIN';
    } else if (comp === '===') {
      fn = 'SUM';
    }
  } else {
    if (comp === '>' || comp === '>=') { // eslint-disable-line
      fn = 'MIN';
    } else if (comp === '<' || comp === '<=') {
      fn = 'MAX';
    } else if (comp === '===') {
      fn = 'SUM';
    }
  }
  return fn;
};

export default function parseText(text) {
  console.log('Original text: ' + text);

  // Clean up to lower case and remove symbols
  let cleanText = text.toLowerCase().replace(/[.,-/#!$%^&*;:{}=\-_`()]/g, '').trim();

  // Remove contractions and 'normalize'
  cleanText = nlp(cleanText).normalize().out();

  // Replace keywords with synonyms
  Object.keys(REPLACE_REVERSE).forEach(word => {
    const replacement = REPLACE_REVERSE[word];
    cleanText = cleanText.replace(new RegExp(`${word} `, 'g'), `${replacement} `);
  });

  console.log('Cleaned text: ' + cleanText);
  // Parse cleaned up text into parts of speech
  const doc = nlp(cleanText);

  // Log parts
  const pos = doc.out('tags');
  const display = pos.map(item => `[${item.text}: ${item.tags.join(',')}]`).join('');
  console.log('pos: ' + display);

  const result = getResult(doc);
  const value = getValue(doc);
  const type = getType(doc);
  const prop = getProp(doc);
  const comp = getComp(doc);

  const fn = getFn(result, comp);

  const constraintData = { text, result, fn, type, prop, comp, value }; // eslint-disable-line
  // It should look something like this
  // const constraintData = {
  //   result: true,
  //   fn: 'MAX',
  //   type: 'Cube',
  //   prop: 'area',
  //   comp: '<',
  //   value: 50
  // };

  console.log(`Constraint result: \n${JSON.stringify(constraintData)}`);

  return constraintData;
}
