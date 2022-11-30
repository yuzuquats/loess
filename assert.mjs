const hasWindow = typeof window != "undefined";
const epsilon = 1 ** -7; // Number.EPSILON
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
const assertEqFloat = (a, b, message) => {
    if (Math.abs(a - b) > epsilon) {
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
const assertEqFloatArr = (a, b, message) => {
    function zip(arrays) {
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
export { assert, assertEqual, assertEqFloat, assertEqFloatArr, assertError };
