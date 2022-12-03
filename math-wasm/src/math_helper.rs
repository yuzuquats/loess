use js_sys::Array;
use wasm_bindgen::prelude::*;

/*
Math Helper
*/

#[wasm_bindgen(js_name = weightFunc)]
pub fn weight_function(d: f32, dmax: f32, degree: f32) -> f32 {
    if d < dmax {
        (1.0 - (d / dmax).powf(degree)).powf(degree)
    } else {
        0.0
    }
}

#[wasm_bindgen]
pub fn normalize(mut arr: Vec<f64>) -> JsValue {
    let cutoff = (0.1 * arr.len() as f64).ceil() as usize;
    arr.sort_by(|a, b| a.partial_cmp(b).unwrap());
    let std = crate::std(&arr[cutoff..arr.len() - cutoff]);
    Closure::once_into_js(move |a: Vec<f64>| a.iter().map(|v| v / std).collect::<Vec<f64>>())
}

#[wasm_bindgen]
pub fn transpose(matrix: Array) -> Array {
    let transposed = Array::new();
    let c: Array = matrix.get(0).into();
    let c_len = c.length();
    for i in 0..c_len {
        let new_arr = matrix.map(&mut |a: JsValue, _, _| {
            let arr: Array = a.into();
            arr.get(i)
        });
        transposed.push(&new_arr);
    }
    transposed
}

#[wasm_bindgen(js_name = euclideanDist)]
pub fn euclidean_distance(orig: Vec<f64>, dest: Vec<f64>) -> f64 {
    if orig.len() < 2 {
        return (orig.get(0).expect("") - dest.get(0).expect("")).abs();
    }

    orig.iter()
        .enumerate()
        .fold(0.0, |a, (i, val)| {
            a + (val - dest.get(i).expect("")).powf(2.0)
        })
        .sqrt()
}
