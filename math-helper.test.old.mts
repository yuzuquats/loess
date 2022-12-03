import { MathHelper } from "./math-helper.mjs";
import { assertEqFloat, assertEqFloatArr } from "./assert.mjs";
import { MathJs } from "./mathjs.mjs";
import type { matrix, arr1d } from "./mathjs.mjs";

function testDistMatrix() {
  console.log("ENTRY: testDistMatrix");
  const origSet: matrix = [[1, 1]];
  const destSet: matrix = [[4, 5]];
  const val: matrix = MathHelper.distMatrix(origSet, destSet);
  assertEqFloatArr(val[0], [5]);

  const origSet1: matrix = [
    [1, 1],
    [2, 2],
  ];
  const destSet1: matrix = [
    [4, 5],
    [5, 6],
  ];
  const val1: matrix = MathHelper.distMatrix(origSet1, destSet1);

  // distance between [1,1] and [4,5], distance between[1,1] and [5,6]
  assertEqFloatArr(val1[0], [5, 6.4031242374328485]);

  // distance between[2,2] and [4,5],  distance between[2,2] and [5,6]
  assertEqFloatArr(val1[1], [3.605551275463989, 5]);

  const caseOne = {
    coordinates: [
      [1, 1],
      [4, 1],
      [4, 5],
    ],
    expect: [
      [0, 3, 5],
      [3, 0, 4],
      [5, 4, 0],
    ],
  };
  // should return matrix of Euclidean distance between pairs of points
  const actual = MathHelper.distMatrix(
    caseOne.coordinates,
    caseOne.coordinates
  );
  assertEqFloatArr(actual[0], caseOne.expect[0]);
  assertEqFloatArr(actual[1], caseOne.expect[1]);
  assertEqFloatArr(actual[2], caseOne.expect[2]);
  console.log("EXIT: testDistMatrix");
}

function testWeightMatrix() {
  console.log("ENTRY: testWeightMatrix");
  const distMat1: matrix = [
    [1, 2, 3],
    [4, 5, 6],
  ];
  const inputWeights: arr1d = [5, 10, 15];
  const bandwidth: number = 3;
  const val = MathHelper.weightMatrix(distMat1, inputWeights, bandwidth);
  console.log(val);

  const distMat = [[5, 4, 3, 2, 1]];

  const caseOne = {
    inputWeights: [1, 1, 1, 1, 1],
    bandwidth: 0.6,
    expect: [[0, 0, 0, 0.348, 0.893]],
  };
  const caseTwo = {
    inputWeights: [1, 1, 1, 1, 1],
    bandwidth: 2,
    expect: [[0.67, 0.82, 0.921, 0.976, 0.997]],
  };

  // span <= 1
  const actual = MathHelper.weightMatrix(
    distMat,
    caseOne.inputWeights,
    caseOne.bandwidth
  );
  actual[0] = MathJs.round(actual[0], 3);
  assertEqFloatArr(actual[0], caseOne.expect[0]);

  // span > 1
  const actual2 = MathHelper.weightMatrix(
    distMat,
    caseTwo.inputWeights,
    caseTwo.bandwidth
  );
  actual2[0] = MathJs.round(actual2[0], 3);
  assertEqFloatArr(actual2[0], caseTwo.expect[0]);
  console.log("EXIT: testWeightMatrix");
}

function testPolynomialExpansion() {
  console.log("ENTRY: testPolynomialExpansion");
  // (a + b + c)^0 >>> (1) {
  const actual1 = MathHelper.polynomialExpansion([1, 2, 3], 0);
  assertEqFloatArr(actual1, [1]);

  // (a + b + c)^1 >>> (1 + a + b + c)
  const actual2 = MathHelper.polynomialExpansion([1, 2, 3], 1);
  assertEqFloatArr(actual2, [1, 1, 2, 3]);

  // (a + b + c)^2 >>> (1 + a + b + c + a2 + ab + ac + b2 + bc + c2)
  const actual3 = MathHelper.polynomialExpansion([1, 2, 3], 2);
  assertEqFloatArr(actual3, [1, 1, 2, 3, 1, 2, 3, 4, 6, 9]);

  // should operates on arrays also
  const actual4 = MathHelper.polynomialExpansion(
    [
      [1, 2],
      [3, 4],
    ],
    2
  );
  // [[1, 1], [1, 2], [3, 4], [1, 4], [3, 8], [9, 16]]);
  assertEqFloatArr(actual4[0], [1, 1]);
  assertEqFloatArr(actual4[1], [1, 2]);
  assertEqFloatArr(actual4[2], [3, 4]);
  assertEqFloatArr(actual4[3], [1, 4]);
  assertEqFloatArr(actual4[4], [3, 8]);
  assertEqFloatArr(actual4[5], [9, 16]);

  const factors: matrix = [
    [1, 2, 3],
    [4, 5, 6],
  ];
  const degree: number = 4;
  const val = MathHelper.polynomialExpansion(factors, degree);

  assertEqFloatArr(val[0], [1, 1, 1]);
  assertEqFloatArr(val[1], [1, 2, 3]);
  assertEqFloatArr(val[2], [4, 5, 6]);
  assertEqFloatArr(val[3], [1, 4, 9]);
  assertEqFloatArr(val[4], [4, 10, 18]);
  assertEqFloatArr(val[5], [16, 25, 36]);
  assertEqFloatArr(val[6], [1, 8, 27]);
  assertEqFloatArr(val[7], [4, 20, 54]);
  assertEqFloatArr(val[8], [16, 50, 108]);
  assertEqFloatArr(val[9], [64, 125, 216]);
  assertEqFloatArr(val[10], [1, 16, 81]);
  assertEqFloatArr(val[11], [4, 40, 162]);
  assertEqFloatArr(val[12], [16, 100, 324]);
  assertEqFloatArr(val[13], [64, 250, 648]);
  assertEqFloatArr(val[14], [256, 625, 1296]);

  /* 
   0: [1, 1, 1]       :  [1,2,3] ^0
   1: [1, 2, 3]       :  [1,2,3] ^1
   2: [4, 5, 6]       :  [4,5,6] ^1
   3: [1, 4, 9]       :  [1,2,3] ^2
   4: [4, 10, 18]     : (1) * (2) 
   5: [16, 25, 36]    :  [4,5,6] ^2
   6: [1, 8, 27]      :  [1,2,3] ^3
   7: [4, 20, 54]     : (2) * (3) 
   8: [16, 50, 108]   : (2) * (4)
   9: [64, 125, 216]  :  [4,5,6] ^3
   10: [1, 16, 81]     :  [1,2,3] ^4
   11: [4, 40, 162]    : (3) * (4)
   12: [16, 100, 324]  : (3) * (5)
   13: [64, 250, 648]  : (4) * (5)
   14: [256, 625, 1296]:  [4,5,6] ^4
  */

  console.log("EXIT: testPolynomialExpansion");
}

// Reference: https://github.com/yongjun21/loess
// https://mathjs.org/docs/reference/functions/mean.html

testWeightFunction();
testNormalization();
testTranspose();
testEuclideanDist();
testDistMatrix();
testWeightMatrix();
testPolynomialExpansion();
