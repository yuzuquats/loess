import { MathJs } from "./mathjs.mjs";
import { assertEqFloat } from "./assert.mjs";
import mathRs from "./math-wasm/pkg/math_wasm.js";
function test(m) {
    const tests = {
        std: () => {
            // assertError(() => library.std([]));
            assertEqFloat(m.std([1]), 0);
            assertEqFloat(m.std([3]), 0);
            assertEqFloat(m.std([1, 2, 3, 4]), 1.2909944487358056);
            assertEqFloat(m.std([1, 2, 3, 4, 5]), 1.5811388300841898);
            assertEqFloat(m.std([1, 1, 1, 1, 1]), 0);
        },
        dotMultiply: () => { },
        sum: () => { },
        multiply: () => { },
        subtract: () => { },
        square: () => { },
        squeeze: () => { },
        inv: () => { },
        matrix: () => { },
        mean: () => { },
        transpose: () => { },
        euclideanDist: () => { },
        distMatrix: () => { },
        round: () => { },
        abs: () => { },
        median: () => { },
        zeroes: () => { },
        ones: () => { },
        sort: () => { },
        size: () => { },
    };
    console.log("  TEST: std");
    tests.std();
}
console.log("Testing Original Library (MathJs)");
test(MathJs);
console.log("  PASSED");
console.log("_________________________________");
console.log("Testing Rust Library (MathJs)");
test(mathRs);
console.log("  PASSED");
