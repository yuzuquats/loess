import { MathJs, type MathJsLibrary } from "./mathjs.mjs";
import { assertEqFloat, assertError, Precision } from "./assert.mjs";
import mathRs from "./math-wasm/pkg/math_wasm.js";

function test(m: MathJsLibrary) {
  const tests = {
    std: () => {
      // assertError(() => library.std([]));
      assertEqFloat(m.std([1]), 0);
      assertEqFloat(m.std([3]), 0);
      assertEqFloat(m.std([1, 2, 3, 4]), 1.2909944487358056, Precision(-7));
      assertEqFloat(m.std([1, 2, 3, 4, 5]), 1.5811388300841898, Precision(-7));
      assertEqFloat(m.std([1, 1, 1, 1, 1]), 0);
    },
    dotMultiply: () => {},
    sum: () => {
      assertEqFloat(m.sum([]), 0);
      assertEqFloat(m.sum([1]), 1);
      assertEqFloat(m.sum([3]), 3);
      assertEqFloat(m.sum([1, 2, 3, 4]), 10);
      assertEqFloat(m.sum([1, 2, 3, 4, 5]), 15);
      assertEqFloat(m.sum([1, 1, 1, 1, 1]), 5);
    },
    multiply: () => {},
    subtract: () => {
      assertEqFloat(m.subtract(5.3, 2), 3.3, Precision(-6));
      assertEqFloat(m.subtract(8, 4), 4, Precision(-5));
      assertEqFloat(m.subtract(1230123, 523), 1229600);
      assertEqFloat(m.subtract(8.23234, 123.32423), -115.09189, Precision(-5));
      assertEqFloat(
        m.subtract(3123091293, 23849273482),
        -20726182189,
        Precision(3)
      );
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
    squeeze: () => {},
    inv: () => {},
    matrix: () => {},
    mean: () => {},
    transpose: () => {},
    euclideanDist: () => {},
    distMatrix: () => {},
    round: () => {},
    abs: () => {},
    median: () => {},
    zeroes: () => {},
    ones: () => {},
    sort: () => {},
    size: () => {},
  };

  console.log("  TEST: std");
  tests.std();
  console.log("  TEST: sum");
  tests.sum();
  console.log("  TEST: square");
  tests.square();
  console.log("  TEST: subtract");
  tests.subtract();
}

console.log("Testing Original Library (MathJs)");
test(MathJs);
console.log("  PASSED");

console.log("_________________________________");
console.log("Testing Rust Library (MathJs)");
test(mathRs as unknown as MathJsLibrary);
console.log("  PASSED");
