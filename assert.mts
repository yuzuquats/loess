import type { matrix, arr1d } from "./math.mjs";

const hasWindow = typeof window != "undefined";

const assert = (test: boolean, message: string) => {
  if (!test) {
    console.error(message);
  }
};
hasWindow && (window.assert = assert);

const assertEqual = (a: any, b: any, message?: string) => {
  if (a != b) {
    if (message) {
      console.error(`'${a}' != '${b}'`);
    } else {
      console.error(`'${a}' != '${b}'`, message);
    }
  }
};
hasWindow && (window.assertEqual = assertEqual);

const assertEqFloat = (a: number, b: number, message?: string) => {
  if (Math.abs(a - b) > Number.EPSILON) {
    if (message) {
      console.error(`'${a}' != '${b}'`);
    } else {
      console.error(`'${a}' != '${b}'`, message);
    }
  }
};
hasWindow && (window.assertEqFloat = assertEqFloat);

const assertEqFloatArr = (a: arr1d, b: arr1d, message?: string) => {
  function zip(arrays: [arr1d, arr1d]) {
    return arrays[0].map(function (_, i) {
      return arrays.map(function (array) {
        return array[i];
      });
    });
  }

  const zipped = zip([a, b]);
  zipped.forEach((e) => assertEqFloat(e[0], e[1], message));
};
hasWindow && (window.assertEqFloatArr = assertEqFloatArr);

export { assert, assertEqual, assertEqFloat, assertEqFloatArr };