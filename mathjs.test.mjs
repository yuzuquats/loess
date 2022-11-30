import { MathJs } from "./mathjs.mjs";
import { assertEqFloat } from "./assert.mjs";
function test(library) {
    console.log(library.std([1, 2, 3, 4]));
    assertEqFloat(library.std([1, 2, 3, 4]), 1.2909944487358056);
    assertEqFloat(library.std([1, 2, 3, 4]), 1);
}
test(MathJs);
