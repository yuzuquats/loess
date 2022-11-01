type MathJsMatrix = any; // const o: Object = { arr: number[][] }
type matrix = Array<Array<number>>;
type arr1d = Array<number>;
type Arr1ToArr1 = (i: arr1d) => arr1d;

// MathJs is the public api for the math.js library publically available
// here: https://mathjs.org
//
const MathJs: {
  std: <T>(
    array: Array<T>,
    normalization?: "unbiased" | "uncorrected" | "biased"
  ) => T;
  dotMultiply: <T>(x: T, y: T) => T;
  sum: <T>(array: Array<T>) => T;
  multiply: <T>(x: T, y: T) => T;
  subtract: <T>(x: T, y: T) => T;
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
  ones: (m: number, n: number) => MathJsMatrix;
  square: (x: Array<number>) => Array<number>;
  sort: (x: arr1d) => arr1d;
  size: (x: matrix) => arr1d;
} =
  // @ts-ignore
  math;

// MathHelper are custom math helper APIs we implement ourselves
// https://github.com/yongjun21/loess/blob/master/src/helpers.js
//
class MathHelper {
  // (1 - (d / dmax) ^ degree) ^ degree valid for d / dmax > 1
  // https://www.itl.nist.gov/div898/handbook/pmd/section1/pmd144.htm#:~:text=As%20mentioned%20above%2C%20the%20weight,points%20that%20are%20furthest%20away.
  // The weight for a specific point in any localized subset of data is
  // obtained by evaluating the weight function at the distance between
  // that point and the point of estimation, after scaling the distance
  // so that the maximum absolute distance over all of the points in the
  // subset of data is exactly one.
  // d: distance between that point and the point of estimation
  // dmax: the maximum absolute distance over all of the points
  /**
   * TODO
   * @param d
   * @param dmax
   * @param degree
   * @returns
   */
  static weightFunc(d: number, dmax: number, degree: number): number {
    return d < dmax ? Math.pow(1 - Math.pow(d / dmax, degree), degree) : 0;
  }

  /**
   * TODO
   * @param referenceArr
   * @returns
   */
  static normalize(referenceArr: arr1d): Arr1ToArr1 {
    const cutoff = Math.ceil(0.1 * referenceArr.length);
    let sorted_arr1 = [...referenceArr].sort((a, b) => a - b);

    // this is to remove the outliers
    const trimmed_arr = sorted_arr1.slice(cutoff, referenceArr.length - cutoff);
    const sd = MathJs.std(trimmed_arr);

    return function (outputArr) {
      return outputArr.map((val) => val / sd);
    };
  }

  /**
   * TODO
   * @param X
   * @returns
   */
  static transpose(X: Array<Array<number>>): Array<Array<number>> {
    const transposed: Array<Array<number>> = [];
    for (let i = 0; i < X[0].length; i++) {
      transposed.push(X.map((x) => x[i]));
    }
    return transposed;
  }

  // find the Euclidean distance
  // d(p,q) = sqrt((p1-q1)^2 + (p2-q2)^2 + (p3-q3)^2 + .....)
  /**
   * TODO
   * @param orig
   * @param dest
   * @returns
   */
  static euclideanDist(orig: arr1d, dest: arr1d): number {
    if (orig.length < 2) {
      return Math.abs(orig[0] - dest[0]);
    } else {
      return Math.sqrt(
        orig.reduce((acc, val, idx) => acc + Math.pow(val - dest[idx], 2), 0)
      );
    }
  }

  // find the distance between two matrices
  // origSet = [arr1, arr2, arr3]
  // destSet = [brr1, brr2, brr3]
  // distanceMatrix = [dist(arr1, brr1), dist(arr1, brr2), dist(arr1, brr3)
  //                   dist(arr2, brr1), dist(arr2, brr2), dist(arr2, brr3)
  //                   dist(arr3, brr1), dist(arr3, brr2), dist(arr3, brr3)]
  /**
   * TODO
   * @param origSet
   * @param destSet
   * @returns
   */
  static distMatrix(origSet: matrix, destSet: matrix): matrix {
    return origSet.map((orig) =>
      destSet.map((dest) => MathHelper.euclideanDist(orig, dest))
    );
  }

  /**
   * TODO
   * @param distMat
   * @param inputWeights
   * @param bandwidth
   * @returns
   */
  static weightMatrix(
    distMat: matrix,
    inputWeights: arr1d,
    bandwidth: number
  ): matrix {
    function zip(arrays: [arr1d, arr1d]) {
      return arrays[0].map(function (_, i) {
        return arrays.map(function (array) {
          return array[i];
        });
      });
    }

    return distMat.map((distVect) => {

      let distVect_copy = [...distVect];
      let inputWeights_copy = [...inputWeights];

      //const sorted = zip([distVect, inputWeights]).sort(v => v[0]);
      const sorted = zip([distVect_copy, inputWeights_copy]).sort(([a1,a2], [b1,b2]) => a1 - b1);
      const cutoff: number = MathJs.sum(inputWeights) * bandwidth;

      let sumOfWeights = 0;
      let cutoffIndex = sorted.findIndex((v) => {
        sumOfWeights += v[1];
        return sumOfWeights >= cutoff;
      });
      let dmax =
        bandwidth > 1
          ? sorted[sorted.length - 1][0] * bandwidth
          : sorted[cutoffIndex][0];
      return MathJs.dotMultiply(
        distVect.map((d) => MathHelper.weightFunc(d, dmax, 3)),
        inputWeights
      );
    });
  }

  /**
   * TODO
   * @param factors
   * @param degree
   * @returns
   */
  static polynomialExpansion <T>(factors: Array<T>, degree: number): Array<T> {
    const expandedSet: Array<T> = [];
    let constTerm: number | arr1d = 1;
    if (Array.isArray(factors[0])) constTerm = Array(factors[0].length).fill(1);
    function crossMultiply(accumulator, pointer, n) {
      if (n > 1) {
        for (let i = pointer; i < factors.length; i++) {
          crossMultiply(MathJs.dotMultiply(accumulator, factors[i]), i, n - 1);
        }
      } else {
        expandedSet.push(accumulator);
      }
    }
    for (let d = 0; d <= degree; d++) crossMultiply(constTerm, 0, d + 1);
    return expandedSet;
  }

  // https://en.wikipedia.org/wiki/Weighted_least_squares

  /**
   * TODO
   * @param predictors
   * @param response
   * @param weights
   * @returns
   */
  static weightedLeastSquare(
    predictors: matrix,
    response: arr1d,
    weights: arr1d
  ) {
    try {
      const weightedY = MathJs.matrix(MathJs.dotMultiply(weights, response));

      const weightedX = MathHelper.transpose(
        //MathJs.matrix(
        predictors.map((x) => {
          return MathJs.dotMultiply(weights, x);
        })
        //)
      );
      const LHS = MathJs.multiply(predictors, weightedX);

      const RHS = MathJs.multiply(predictors, weightedY);

      // find the coefficients
      const beta = MathJs.multiply(MathJs.inv(LHS), RHS);

      // find  yhat = coeffienct * predictors
      const yhat = MathJs.squeeze(MathJs.multiply(beta, predictors));

      // residual = actual - predicted
      const residual = MathJs.subtract(response, yhat);
      return { beta, yhat, residual };
    } catch (err) {
      console.error(err);
      return { error: err };
    }
  }
}
