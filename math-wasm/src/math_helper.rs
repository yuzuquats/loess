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
