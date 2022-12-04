//#![feature(trait_alias)]

use wasm_bindgen::prelude::*;
use js_sys::Array;
use js_sys::Uint16Array;

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

//#[wasm_bindgen]
//pub fn dotMultiply(left: Matrix, right: Matrix) -> Matrix {
    //TODO
//}

#[wasm_bindgen]
pub fn sum(values: Vec<f32>) -> f32 {
    values.iter().fold(0.0, |a, v| a + v)
}

//#[wasm_bindgen]
//pub fn multiply(left: Matrix, right: Matrix) -> Matrix {
    //TODO
//}

#[wasm_bindgen]
pub fn subtract(a: f32, b: f32) -> f32 {
    a - b
}

#[wasm_bindgen]
pub fn square(n: f32) -> f32 {
    n.powf(2.0)
}

//#[wasm_bindgen]
//pub fn squeeze(matrix: Matrix) -> Matrix {
    //TODO
//}

//#[wasm_bindgen]
//pub fn inv(matrix: Matrix) -> Matrix {
    //TODO
//}

#[wasm_bindgen]
pub fn mean(values: &[f64]) -> f64 {
    let len = values.len() as f64;
    let mean = values.iter().fold(0.0, |accum, v| accum + v) / len;
    mean

}

#[wasm_bindgen]
pub fn round(x: f32, decimals: u32) -> f32 {
    let y = 10i32.pow(decimals) as f32;
    (x * y).round() / y
}

#[wasm_bindgen]
pub fn abs(values: Vec<f64>) -> js_sys::Float64Array {
    let size  = values.len(); 
    let array = js_sys::Float64Array::new_with_length(size as u32);
    for i in 0..size {
        array.set_index(i as u32, values[i].abs())
    }
    array

}

#[wasm_bindgen]
pub fn median(mut values: Vec<f64>) -> f64 {    
    let size = values.len();
    values.sort_by(|a, b| a.partial_cmp(b).expect("a must be comparable to b"));
    let mid = size/2;
    if size % 2 == 0 {
        let med_1 = values[mid - 1];
        let med_2 = values[mid];
        return (med_1 + med_2) / 2.0;
    } 
    
    let med = values[mid];
    med
    
}

#[wasm_bindgen]
pub fn zeros(n: u32) -> Uint16Array {
    let array = js_sys::Uint16Array::new_with_length(n);
    array.fill(0, 0, n)
}

#[wasm_bindgen]
pub fn ones(n: u32) -> Uint16Array {
    let array = js_sys::Uint16Array::new_with_length(n);
    array.fill(1, 0, n)
}

//#[wasm_bindgen]
//pub fn size(n: f32) -> f32 {
//    // TODO
//}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
