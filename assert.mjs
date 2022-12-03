const hasWindow = typeof window != "undefined";
export const PRECISION_FINE = Number.EPSILON;
function memo(fn, mem = new Map()) {
    return (t) => {
        const r = mem.get(t);
        if (r)
            return r;
        const rr = fn(t);
        mem.set(t, rr);
        return rr;
    };
}
export const Precision = memo((pow) => Math.pow(10, pow));
const assertError = (fn) => {
    try {
        fn();
    }
    catch {
        return;
    }
    throw new Error("Error (error was not raised)");
};
const assert = (test, message) => {
    if (!test) {
        console.error(message);
        throw new Error(`Error (assertion failed): ${message}`);
    }
};
hasWindow && (window.assert = assert);
const assertEqual = (a, b, message) => {
    if (a != b) {
        if (!message) {
            console.error(a, "!=", b);
            throw new Error(`Error (assertion failed | ${a} != ${b})`);
        }
        else {
            console.error(a, "!=", b, ">>", message);
            throw new Error(`Error (assertion failed | ${a} != ${b}): ${message}`);
        }
    }
};
hasWindow && (window.assertEqual = assertEqual);
const assertEqFloat = (a, b, precision = Number.EPSILON, message) => {
    if (Math.abs(a - b) > precision) {
        const p = 1 / Math.abs(a - b);
        const suggestedBase = -Math.floor(Math.log10(p));
        console.error("\n\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.error(`Try using Precision(${suggestedBase}) instead? (We should **try** to not go above Precision(0), however. Otherwise 1 == 2)`);
        console.error("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        if (!message) {
            console.error(a, "!=", b);
            throw new Error(`Error (assertion failed | ${a} != ${b})`);
        }
        else {
            console.error(a, "!=", b, ">>", message);
            throw new Error(`Error (assertion failed | ${a} != ${b}): ${message}`);
        }
    }
};
hasWindow && (window.assertEqFloat = assertEqFloat);
const assertEqFloatArr = (a, b, precision, message) => {
    assertEqual(a.length, b.length, "asserting an array - arrays should have the same length");
    function zip(arrays) {
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
export { assert, assertEqual, assertEqFloat, assertEqFloatArr, assertError };
