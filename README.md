1. (Done) Step 1

Add tests for math.ts

2. Step 2

Download VSCode extensions for "Prettier - Code formatter"
Download VSCode extensions for "ESLint"

3. (Low priority) Step 3

Add javadocs for `math.ts`. See TODOs

4. Step 4

Add tests to loess-validator.ts

- Create a file named loess-validator.test.ts
- Import loess-validator.test.ts to index.html (see math.test.ts)
- Create a test function in loess-validator.test.ts and see that it runs
  Fix type errors in loess-validator.ts
  Add documentation to loess-validator.ts

---

5. Step 5

Fix Typescript Errors
You can rerun tests with

```
node mathjs.test.mjs
node math-helper.test.mjs
```

6. Step 6

Remove TODOTYPE with proper types

7. Step 7

Create your first wasm function call

```
cargo install wasm-pack
cd ./mathrs/math-wasm
wasm-pack build --target nodejs
```

Edit `./mathrs/math-wasm/lib.rs` and add a new function:

```
#[wasm_bindgen]
pub fn minus(left: i64, right: i64) -> i64 {
    left - right
}
```

Then recompile

```
// cd ./mathrs/math-wasm

wasm-pack build --target nodejs
```

Then within ./math-wasm.test.mts, add a function for `testMinus`

```
// cd .

function testMinus() {
  // Exercise left for the viewer
}
```

Now run it:

```
// cd .

tsc;node math-wasm.test.mjs
```
