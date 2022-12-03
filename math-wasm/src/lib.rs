#![feature(trait_alias)]

use wasm_bindgen::prelude::*;

mod math_helper;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_f32(a: f32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub fn add(left: usize, right: usize) -> usize {
    left + right
}

#[wasm_bindgen]
pub fn std(values: &[f64]) -> f64 {
    let len = values.len() as f64;
    let mean = values.iter().fold(0.0, |accum, v| accum + v) / len;
    let variance = values
        .iter()
        .fold(0.0, |accum, v| accum + (v - mean).powf(2.0))
        / (len - 1.0);
    f64::sqrt(variance)
}

#[wasm_bindgen]
pub fn sum(values: Vec<f32>) -> f32 {
    values.iter().fold(0.0, |a, v| a + v)
}

#[wasm_bindgen]
pub fn subtract(a: f32, b: f32) -> f32 {
    a - b
}

#[wasm_bindgen]
pub fn square(n: f32) -> f32 {
    n.powf(2.0)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
