import type { arr1d, Matrix } from "./mathjs.mjs";

const hasWindow = typeof window != "undefined";

export const PRECISION_FINE = Number.EPSILON;

function memo<T, R>(fn: (t: T) => R, mem: Map<T, R> = new Map()): (t: T) => R {
  return (t: T) => {
    const r = mem.get(t);
    if (r) return r;

    const rr = fn(t);
    mem.set(t, rr);
    return rr;
  };
}

export const Precision = memo((pow: number) => Math.pow(10, pow));

const assertError = (fn: () => void) => {
  try {
    fn();
  } catch {
    return;
  }
  throw new Error("Error (error was not raised)");
};

const assert = (test: boolean, message: string) => {
  if (!test) {
    console.error(message);
    throw new Error(`Error (assertion failed): ${message}`);
  }
};
hasWindow && (window.assert = assert);

const assertEqual = (a: any, b: any, message?: string) => {
  if (a != b) {
    if (!message) {
      console.error(a, "!=", b);
      throw new Error(`Error (assertion failed | ${a} != ${b})`);
    } else {
      console.error(a, "!=", b, ">>", message);
      throw new Error(`Error (assertion failed | ${a} != ${b}): ${message}`);
    }
  }
};
hasWindow && (window.assertEqual = assertEqual);

const assertEqFloat = (
  a: number,
  b: number,
  precision: number = Number.EPSILON,
  message?: string
) => {
  if (Math.abs(a - b) > precision) {
    const p = 1 / Math.abs(a - b);
    const suggestedBase = -Math.floor(Math.log10(p));

    console.error("\n\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.error(
      `Try using Precision(${suggestedBase}) instead? (We should **try** to not go above Precision(0), however. Otherwise 1 == 2)`
    );
    console.error("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    if (!message) {
      console.error(a, "!=", b);
      throw new Error(`Error (assertion failed | ${a} != ${b})`);
    } else {
      console.error(a, "!=", b, ">>", message);
      throw new Error(`Error (assertion failed | ${a} != ${b}): ${message}`);
    }
  }
};
hasWindow && (window.assertEqFloat = assertEqFloat);

const assertEqFloatMatrix = (
  a: Matrix,
  b: Matrix,
  precision: number = Number.EPSILON,
  message?: string
) => {
  assertEqual(
    a.length,
    b.length,
    "asserting an array - arrays should have the same length"
  );
  for (const [index, aRow] of a.entries()) {
    assertEqFloatArr(aRow, b[index], precision, message);
  }
};
hasWindow && (window.assertEqFloatMatrix = assertEqFloatMatrix);

const assertEqFloatArr = (
  a: arr1d,
  b: arr1d,
  precision: number = Number.EPSILON,
  message?: string
) => {
  assertEqual(
    a.length,
    b.length,
    "asserting an array - arrays should have the same length"
  );
  function zip(arrays: [arr1d, arr1d]) {
    return arrays[0].map(function (_, i) {
      return arrays.map(function (array) {
        return array[i];
      });
    });
  }

  const zipped = zip([a, b]);
  zipped.forEach((e) => assertEqFloat(e[0], e[1], precision, message));
};
hasWindow && (window.assertEqFloatArr = assertEqFloatArr);

export {
  assert,
  assertEqual,
  assertEqFloat,
  assertEqFloatArr,
  assertError,
  assertEqFloatMatrix,
};
