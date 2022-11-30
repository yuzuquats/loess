import { MathJs, type MathJsLibrary } from "./mathjs.mjs";
import { assertEqFloat, assertError } from "./assert.mjs";

function test(library: MathJsLibrary) {
  console.log("  TEST: std");
  assertError(() => library.std([]));
  assertEqFloat(library.std([1]), 0);
  assertEqFloat(library.std([3]), 0);
  assertEqFloat(library.std([1, 2, 3, 4]), 1.2909944487358056);
  assertEqFloat(library.std([1, 2, 3, 4, 5]), 1.5811388300841898);
  assertEqFloat(library.std([1, 1, 1, 1, 1]), 0);
}

console.log("Testing Original Library (MathJs)");
test(MathJs);

console.log("_________________________________");
console.log("Testing Rust Library (MathJs)");
