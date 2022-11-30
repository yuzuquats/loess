// @ts-ignore
import math from "./third-party/mathjs.js";

export type MathJsMatrix = any; // const o: Object = { arr: number[][] }
export type matrix = Array<Array<number>>;
export type arr1d = Array<number>;
export type Arr1ToArr1 = (i: arr1d) => arr1d;

console.log(math);
console.log(math.std);

// MathJs is the public api for the math.js library publically available
// here: https://mathjs.org
//
export const MathJs: {
  std: <T>(
    array: Array<T>,
    normalization?: "unbiased" | "uncorrected" | "biased"
  ) => T;
  dotMultiply: <T>(x: T, y: T) => T;
  sum: <T>(array: Array<T>) => T;
  multiply: <T>(x: T, y: T) => T;
  subtract: <T>(x: T, y: T) => T;
  square: <T>(x: T) => T;
  squeeze: <T>(x: T) => T;
  inv: <T>(x: T) => T;
  matrix: <T>(m: Array<T>) => MathJsMatrix;
  mean: <T>(
    array: Array<T>,
    normalization?: "unbiased" | "uncorrected" | "biased"
  ) => T;

  transpose: (x: matrix) => matrix;
  euclideanDist: (orig: arr1d, dest: arr1d) => number;
  distMatrix: (origSet: matrix, destSet: matrix) => matrix;
  round: <T>(x: T, y: number) => T;
  abs: (x: Array<number>) => Array<number>;
  median: (x: Array<number>) => number;
  zeros: (length: number) => Array<number>;
  ones: (m: number) => Array<number>;
  //ones: (m: number, n: number) => MathJsMatrix;
  sort: (x: arr1d) => arr1d;
  size: (x: matrix) => arr1d;
} =
  // @ts-ignore
  math;
