import {
  stripLeadingQuestionMark,
  prependQuestionMark,
  simpleObjectToQueryString,
  queryStringToSimpleObject,
  specialJSONStringify,
} from '../Utils';

test('stripLeadingQuestionMark', () => {
  expect(stripLeadingQuestionMark('?key=value')).toEqual('key=value');
  expect(stripLeadingQuestionMark('key=value')).toEqual('key=value');
})

test('prependQuestionMark', () => {
  expect(prependQuestionMark('key=value')).toEqual('?key=value');
  expect(prependQuestionMark('?key=value')).toEqual('?key=value');
})

describe('simpleObjectToQueryString', () => {
  test('empty object should return empty string', () => {
    expect(simpleObjectToQueryString({})).toEqual('');
  })

  test('single key-value pairs', () => {
    expect(simpleObjectToQueryString({someKey: 'someValue'})).toEqual('?someKey=someValue')
  })

  test('should not add explicit undefined values to resulting query string', () => {
    expect(simpleObjectToQueryString({someKey: undefined})).toEqual('')
    expect(simpleObjectToQueryString({
      someKey: undefined,
      someOtherKey: 'someOtherValue'
    })).toEqual('?someOtherKey=someOtherValue');
  })

  test('Multiple key-value pairs', () => {
    expect(simpleObjectToQueryString({
      someKey: 'someValue',
      someOtherKey: 'someOtherValue'
    })).toEqual('?someKey=someValue&someOtherKey=someOtherValue');
  })

  test('should match URLSearchParams API examples on MDN', () => {
    expect(simpleObjectToQueryString({
      q: 'URLUtils.searchParams',
      topic: 'More webdev',
    })).toEqual('?q=URLUtils.searchParams&topic=More+webdev')
    expect(simpleObjectToQueryString({
      'http://example.com/search?query': '@'
    })).toEqual('?http://example.com/search?query=%40')
  })
})

describe('queryStringToSimpleObject', () => {
  test('empty string should return empty object', () => {
    expect(queryStringToSimpleObject('')).toEqual({});
    expect(queryStringToSimpleObject('?')).toEqual({});
  })

  test('single key-value pair', () => {
    expect(queryStringToSimpleObject('?someKey=someValue')).toEqual({
      someKey: 'someValue'
    })
    expect(queryStringToSimpleObject('someKey=someValue')).toEqual({
      someKey: 'someValue'
    })
  })

  test('Multiple key-value pairs', () => {
    expect(queryStringToSimpleObject('?someKey=someValue&someOtherKey=someOtherValue')).toEqual({
      someOtherKey: 'someOtherValue',
      someKey: 'someValue',
    })
    expect(queryStringToSimpleObject('someKey=someValue&someOtherKey=someOtherValue')).toEqual({
      someOtherKey: 'someOtherValue',
      someKey: 'someValue',
    })
  })
  test('should match URLSearchParams API examples on MDN', () => {
    expect(queryStringToSimpleObject('?q=URLUtils.searchParams&topic=More+webdev')).toEqual({
      q: 'URLUtils.searchParams',
      topic: 'More webdev',
    })
  });
})

describe('specialJSONStringify', () => {
  test('Empty object', () => {
    expect(specialJSONStringify({})).toEqual('{}');
  })
  test('Should work for variety of key and value types', () => {
    const input = {
      a: 1,
      'b-c': [1, 'x', true],
      d: 'e',
    };
    expect(specialJSONStringify(input)).toEqual(
      '{"a":1,"b-c":[1,"x",true],"d":"e"}'
    );
  });
  test('Hash output should be independent of input\'s key order', () => {
    const input1 = {
      a: 1,
      'b-c': [1, 'x', true],
      d: 'e',
    };
    const input2 = {
      'b-c': [1, 'x', true],
      a: 1,
      d: 'e',
    };
    expect(specialJSONStringify(input1)).toEqual(specialJSONStringify(input2));
  });

  test('Should still work if some extra `undefined` proeprties are added', () => {
    const input1 = {
      a: 1,
      'b-c': [1, 'x', true],
      d: 'e',
    };
    const input2 = {
      'b-c': [1, 'x', true],
      a: 1,
      d: 'e',
      f: undefined,
    };
    expect(specialJSONStringify(input1)).toEqual(specialJSONStringify(input2));
  });

  test('Should work for values that are objects', () => {
    const innerInput1 = {
      a: 1,
      'b-c': [1, 'x', true],
      d: 'e',
    };
    const innerInput2 = {
      'b-c': [1, 'x', true],
      a: 1,
      f: undefined,
      d: 'e',
    };
    const outerInput1 = {
      key: innerInput1,
    };
    const outerInput2 = {
      key: innerInput2,
    }
    expect(specialJSONStringify(outerInput1)).toEqual(specialJSONStringify(outerInput2));
  })
});

