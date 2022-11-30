# README

## Important

Everything is migrated to node. Workflows:

a. Compile the code to run it on the browser

```
// cd .

tsc --watch
npm run build

// macos
open index.html
// windows (?)
chrome.exe index.html
```

b. Run tests

```
tsc --watch
node mathjs.test.mjs
node math-helper.test.mjs
```

---

## TODOs

1. **Fix Typescript Errors**

   Run typescript and observe lots of errors

   ```
   tsc --watch
   ```

2. **Remove temporary type**

   find all "TODOTYPE" in the codebase and remove

3. **Create your first wasm function call**

   i. Install and try building node!

   ```
   cargo install wasm-pack
   cd ./mathrs/math-wasm
   wasm-pack build --target nodejs
   ```

   ii. Edit `./mathrs/math-wasm/lib.rs` and add a new function:

   ```
   #[wasm_bindgen]
   pub fn minus(left: i64, right: i64) -> i64 {
       left - right
   }
   ```

   iii. Recompile the rust library

   ```
   // cd ./mathrs/math-wasm

   wasm-pack build --target nodejs
   ```

   iv. Add a new javascript test

   Then within ./math-wasm.test.mts, add a function for `testMinus`

   ```
   // cd .

   function testMinus() {
     // Exercise left for the viewer
   }
   ```

   v. Now run it:

   ```
   // cd .

   tsc;node math-wasm.test.mjs
   ```

---

## Future

Convert MathJs to Rust for 1d/scalar values

Convert MathHelper to Rust

Convert Gaussian to Rust

Convert Loess to Rust

Use ndarray in math-wasm
(https://github.com/rust-ndarray/ndarray/blob/master/README-quick-start.md)
(https://docs.rs/ndarray/latest/ndarray/)

Remove std dependency from math-wasm
