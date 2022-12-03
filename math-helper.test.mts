import { assertEqFloat, assertError, Precision } from "./assert.mjs";
import mathRs from "./math-wasm/pkg/math_wasm.js";
import type { matrix, arr1d } from "./mathjs.mjs";
import { MathHelper, type MathHelperLib } from "./math-helper.mjs";

function test(m: MathHelperLib) {
  const tests = {
    weightFunction: () => {
      assertEqFloat(m.weightFunc(2, 5, 3), 0.8200258559999998, Precision(-7));
      assertEqFloat(m.weightFunc(3, 5, 3), 0.48189030400000005, Precision(-7));
      assertEqFloat(m.weightFunc(4, 5, 3), 0.11621427199999991, Precision(-7));
      assertEqFloat(m.weightFunc(5, 5, 3), 0);
      assertEqFloat(m.weightFunc(7, 5, 3), 0);

      //should return (1-(d/dmax)^n)^n if d < dmax
      assertEqFloat(m.weightFunc(0.5, 1, 3), 0.669921875);
      assertEqFloat(m.weightFunc(0.5, 1, 2), 0.5625);

      //should return 0 if d >= dmax
      assertEqFloat(MathHelper.weightFunc(1, 1, 3), 0);
      assertEqFloat(MathHelper.weightFunc(1, 1, 2), 0);
    },
  };

  console.log("  TEST: weightFunction");
  tests.weightFunction();
}

console.log("Testing Original Library (MathHelper)");
test(MathHelper);
console.log("  PASSED");

console.log("_________________________________");
console.log("Testing Rust Library (MathHelper)");
test(mathRs as unknown as MathHelperLib);
console.log("  PASSED");
