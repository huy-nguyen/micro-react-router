const questionMark = '?';
const equalSign = '=';
const ampersandSign = '&';

export const stripLeadingQuestionMark =
  (input: string) => (input[0] === questionMark) ? input.slice(1) : input;

export const prependQuestionMark =
  (input: string) => (input[0] === questionMark) ? input : questionMark + input;

export const simpleObjectToQueryString = (input: Record<string, string | undefined>): string => {
  let result: string = '';
  let isFirstIteration = true;

  for (const key in input) {
    if (input.hasOwnProperty(key)) {
      const value = input[key];
      // Note: encode spaces with `+` instead of `%20`:
      if (value !== undefined) {
        const encodedValue = encodeURIComponent(value).replace(/%20/, '+');
        if (isFirstIteration === true) {
          result = questionMark + key + equalSign + encodedValue;
        } else {
          result = result + ampersandSign + key + equalSign + encodedValue;
        }
        isFirstIteration = false;
      }
    }
  }
  return result;
}

// Note: input can either have or not have leading question mark:
export const queryStringToSimpleObject = (input: string) => {
  const withoutLeadingQuestionMark = stripLeadingQuestionMark(input);
  if (withoutLeadingQuestionMark === '') {
    return {};
  } else {
    const pairs = withoutLeadingQuestionMark.split(ampersandSign);
    let output: Record<string, string> = {};
    for (const pair of pairs) {
      const [key, value] = pair.split(equalSign);
      const decodedValue = decodeURIComponent(value.replace('+', '%20'));
      output[key] = decodedValue;
    }
    return output;
  }
}

// This function is quite similar to `JSON.stringify`. The main differences are:
// 1) It sorts objects' keys alphabetically before stringify-ing them so that
// the order of keys do not affect the result and 2) it removes key-value pairs
// whose values are `undefined` so that these pairs don't affect the result.
export const specialJSONStringify = (input: null | boolean | number | string | Record<string, any>) => {
  // Defer to `JSON.stringify` for primitive values:
  if (input === null || typeof input === 'boolean' ||
        typeof input === 'number' || typeof input === 'string') {
    return JSON.stringify(input);
  } else {
    if (Array.isArray(input)) {
      let result = '['
      let isFirstIteration = true;
      for (const elem of input) {
        const separator = isFirstIteration ? '' : ',';
        if (isFirstIteration === true) {
          isFirstIteration = false;
        }
        result = result + separator + specialJSONStringify(elem);
      }
      result += ']';
      return result;
    } else {
      const keyValuePairs: [string, any][] = [];
      for (const key in input) {
        if (input.hasOwnProperty(key)) {
          const value = input[key];
          if (value !== undefined) {
            const stringifiedValue = specialJSONStringify(value);
            keyValuePairs.push([key, stringifiedValue]);
          }
        }
      }
      keyValuePairs.sort(([key1,], [key2, ]) => {
        if (key1 > key2) {
          return 1;
        }
        if (key1 < key2) {
          return -1;
        }
        return 0;
      });

      let result = '{';
      let isFirstIteration = true;
      for (const [key, value] of keyValuePairs) {
        const separator = isFirstIteration ? '' : ',';
        if (isFirstIteration === true) {
          isFirstIteration = false;
        }
        result = result + separator + JSON.stringify(key) + ':' + value;
      }
      result += '}';
      return result;
    }
  }
}

export const retrieveNonNullableValueFromRecord = <T, K extends keyof T>(obj: T, key: K, recordName: string): T[K] => {
  const retrieved = obj[key];
  if (retrieved === undefined) {
    throw new Error('Cannot find value for key ' + key + ' in ' + recordName);
  }
  return retrieved;
}

