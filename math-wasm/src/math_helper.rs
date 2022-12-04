use js_sys::Array;
use wasm_bindgen::prelude::*;

type Matrix = Array;

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
    arr.sort_by(|a, b| a.partial_cmp(b).expect("a must be comparable to b"));
    let std = crate::std(&arr[cutoff..arr.len() - cutoff]);
    Closure::once_into_js(move |a: Vec<f64>| a.iter().map(|v| v / std).collect::<Vec<f64>>())
}

#[wasm_bindgen]
pub fn transpose(matrix: Matrix) -> Matrix {
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
        .fold(0.0, |accum, (i, val)| {
            accum + (val - dest.get(i).expect("")).powf(2.0)
        })
        .sqrt()
}

pub fn into_f64_vec(a: &Array) -> Vec<f64> {
    let mut v = Vec::with_capacity(a.length() as usize);
    for i in 0..a.length() {
        v[i as usize] = a.get(i).as_f64().expect("");
    }
    v
}

#[wasm_bindgen(js_name = distMatrix)]
pub fn distance_matrix(origSet: Matrix, destSet: Matrix) -> Matrix {
    origSet.map(&mut |a: JsValue, _, _| {
        let a_arr: Array = a.into();
        destSet
            .map(&mut |b: JsValue, _, _| {
                let b_arr: Array = b.into();
                euclidean_distance(into_f64_vec(&a_arr), into_f64_vec(&b_arr)).into()
                // 5.0.into()
            })
            .into()
    })
}

#[wasm_bindgen(js_name = weightMatrix)]
pub fn weight_matrix() {
    // function zip(arrays: [arr1d, arr1d]) {
    //   return arrays[0].map(function (_, i) {
    //     return arrays.map(function (array) {
    //       return array[i];
    //     });
    //   });
    // }

    // return distMat.map((distVect) => {
    //   let distVect_copy = [...distVect];
    //   let inputWeights_copy = [...inputWeights];

    //   //const sorted = zip([distVect, inputWeights]).sort(v => v[0]);
    //   const sorted = zip([distVect_copy, inputWeights_copy]).sort(
    //     ([a1, a2], [b1, b2]) => a1 - b1
    //   );
    //   const cutoff: number = MathJs.sum(inputWeights) * bandwidth;

    //   let sumOfWeights = 0;
    //   let cutoffIndex = sorted.findIndex((v) => {
    //     sumOfWeights += v[1];
    //     return sumOfWeights >= cutoff;
    //   });
    //   let dmax =
    //     bandwidth > 1
    //       ? sorted[sorted.length - 1][0] * bandwidth
    //       : sorted[cutoffIndex][0];
    //   return MathJs.dotMultiply(
    //     distVect.map((d) => MathHelper.weightFunc(d, dmax, 3)),
    //     inputWeights
    //   );
    // });
}
