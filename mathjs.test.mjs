import { MathJs } from "./mathjs.mjs";
import { assertEqFloat, assertEqFloatArr, Precision } from "./assert.mjs";
import mathRs from "./math-wasm/pkg/math_wasm.js";
function test(m) {
    const tests = {
        std: () => {
            // assertError(() => library.std([]));
            assertEqFloat(m.std([1]), 0);
            assertEqFloat(m.std([3]), 0);
            assertEqFloat(m.std([1, 2, 3, 4]), 1.2909944487358056, Precision(-7));
            assertEqFloat(m.std([1, 2, 3, 4, 5]), 1.5811388300841898, Precision(-7));
            assertEqFloat(m.std([1, 1, 1, 1, 1]), 0);
        },
        dotMultiply: () => {
            assertEqFloatMatrix(m.dotMultiply([[9, 5], [6, 1]], [[3, 2], [5, 2]]), [[27, 10], [30, 2]], Precision(-5));
        },
        sum: () => {
            assertEqFloat(m.sum([]), 0);
            assertEqFloat(m.sum([1]), 1);
            assertEqFloat(m.sum([3]), 3);
            assertEqFloat(m.sum([1, 2, 3, 4]), 10);
            assertEqFloat(m.sum([1, 2, 3, 4, 5]), 15);
            assertEqFloat(m.sum([1, 1, 1, 1, 1]), 5);
        },
        multiply: () => { },
        subtract: () => {
            assertEqFloat(m.subtract(5.3, 2), 3.3, Precision(-6));
            assertEqFloat(m.subtract(8, 4), 4, Precision(-5));
            assertEqFloat(m.subtract(1230123, 523), 1229600);
            assertEqFloat(m.subtract(8.23234, 123.32423), -115.09189, Precision(-5));
            assertEqFloat(m.subtract(3123091293, 23849273482), -20726182189, Precision(3));
            assertEqFloat(m.subtract(0, 0), 0);
            // assertEqFloat(m.subtract(Number.MAX_VALUE, 0), Number.MAX_VALUE);
            // assertEqFloat(
            //   m.subtract(Number.MAX_VALUE, Number.MIN_VALUE),
            //   Number.POSITIVE_INFINITY
            // );
        },
        square: () => {
            assertEqFloat(m.square(1), 1);
            assertEqFloat(m.square(2), 4);
            assertEqFloat(m.square(3), 9);
            assertEqFloat(m.square(4), 16);
            assertEqFloat(m.square(3.5), 3.5 ** 2);
            assertEqFloat(m.square(2.9), 2.9 ** 2, Precision(-6));
            assertEqFloat(m.square(892.3), 892.3 ** 2, Precision(-1));
            assertEqFloat(m.square(123123.3), 123123.3 ** 2, Precision(3));
        },
        squeeze: () => { },
        inv: () => { },
        matrix: () => { },
        mean: () => {
            assertEqFloat(m.mean([1, 2.7, 3.2, 4]), 2.725, Precision(-6));
        },
        round: () => {
            assertEqFloat(m.round(3.22, 1), 3.2, Precision(3));
        },
        abs: () => {
            assertEqFloat(m.abs([-3.22]), [3.22], Precision(3));
        },
        median: () => {
            assertEqFloat(m.median([5, 2, 7]), 5, Precision(3));
            assertEqFloat(m.median([3, -1, 5, 7]), 4, Precision(3));
        },
        zeroes: () => {
            assertEqFloatArr(m.zeros(3)._data, [0, 0, 0], Precision(3));
        },
        ones: () => {
            assertEqFloatArr(m.ones(3)._data, [1, 1, 1], Precision(3));
        },
        sort: () => { },
        size: () => { },
    };
    console.log("  TEST: std");
    tests.std();
    console.log("  TEST: sum");
    tests.sum();
    console.log("  TEST: square");
    tests.square();
    console.log("  TEST: subtract");
    tests.subtract();
    console.log("  TEST: mean");
    tests.mean();
    console.log("  TEST: median");
    tests.median();
    console.log("  TEST: abs");
    tests.abs();
    console.log("  TEST: ones");
    tests.ones();
    console.log("  TEST: zeros");
    tests.zeroes();
}
console.log("Testing Original Library (MathJs)");
test(MathJs);
console.log("  PASSED");
console.log(MathJs.ones(3));
console.log(mathRs.ones(3));
console.log("_________________________________");
console.log("Testing Rust Library (MathJs)");
test(mathRs);
console.log("  PASSED");
