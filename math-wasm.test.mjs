import { add } from "./math-wasm/pkg/math_wasm.js";
function testAdd() {
    {
        const result = add(1, 2);
        console.log(result);
    }
}
testAdd();
