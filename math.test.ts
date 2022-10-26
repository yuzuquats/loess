function testWeightFunction__(
  d: number,
  dmax: number,
  degree: number,
  expected: number
) {
  const actual = MathHelper.weightFunc(d, dmax, degree);
  assertEqFloat(actual, expected);
}

function testWeightFunction() {
  testWeightFunction__(2, 5, 3, 0.8200258559999998);

  testWeightFunction__(3, 5, 3, 0.48189030400000005);

  testWeightFunction__(4, 5, 3, 0.11621427199999991);

  testWeightFunction__(5, 5, 3, 0);

  testWeightFunction__(7, 5, 3, 0);
}

function testNormalization() {
  var norm_func = MathHelper.normalize([
    11, 22, 33, 44, 55, 66, 77, 88, 99, 111, 122, 133,
  ]);
  const val = norm_func([2, 4, 6, 8, 10]);

  console.log(val);
  const sd = MathJs.std(val);
  console.log("sd of the normalized array:", sd);
}

function testTranspose() {
  const y: matrix = MathHelper.transpose([
    [1, 2, 3],
    [4, 5, 6],
  ]);
  assertEqFloatArr(y[0], [1, 4]);
  assertEqFloatArr(y[1], [2, 5]);
  assertEqFloatArr(y[2], [3, 6]);
}

function testEuclideanDist() {
  const orig: arr1d = [1, 2];
  const dest: arr1d = [4, 6];
  const y: number = MathHelper.euclideanDist(orig, dest);
  assertEqFloat(y, 5);
}

function testDistMatrix() {
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
}

function testWeightMatrix() {
  const distMat: matrix = [
    [1, 2, 3],
    [4, 5, 6],
  ];
  const inputWeights: arr1d = [5, 10, 15];
  const bandwidth: number = 3;
  const val = MathHelper.weightMatrix(distMat, inputWeights, bandwidth);
  console.log(val);

  //const test = [4,3,2,1];
  //const test1 = test.sort((v) => {console.log('inside:', v); return v});
  //const test1 = test.sort();
  //console.log('test1',test1);
}

function testPolynomialExpansion() {
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
}

/*
python code:
def WLS():
    nsample = 20
    x = np.linspace(0, 20, nsample)
    X = np.column_stack((x, (x - 5) ** 2))

    X = sm.add_constant(X)
    beta = [5.0, 0.5, -0.01]
    sig = 0.5
    w = np.ones(nsample)
    w[nsample * 6 // 10 :] = 3
    y_true = np.dot(X, beta)
    e = np.random.normal(size=nsample)
    y = y_true + sig * w * e
    X = X[:, [0, 1]]
    print ('y:', ','.join([str(e) for e in y]))
    print ('X:', ','.join([str(e[1]) for e in X]))
    weights = 1.0 / (w ** 2)
    print ('weights:', ','.join([str(e) for e in weights]))
    mod_wls = sm.WLS(y, X, weights=weights)
    res_wls = mod_wls.fit()
    print(res_wls.summary())

y: 3.8236908897147006,5.0747303834465125,6.355867411176375,6.397071283814187,7.525434024796404,7.68763992193726,7.989687054915335,8.60134881977805,9.597267883254144,10.087387925664325,9.26158825319585,10.227048374025388,10.03735539202654,11.5497486362428,9.978466513812624,12.850257489991055,10.169131742063438,15.285895620477806,11.064395784378636,10.192523264076709
X: 0.0,1.0526315789473684,2.1052631578947367,3.1578947368421053,4.2105263157894735,5.263157894736842,6.315789473684211,7.368421052631579,8.421052631578947,9.473684210526315,10.526315789473683,11.578947368421051,12.631578947368421,13.68421052631579,14.736842105263158,15.789473684210526,16.842105263157894,17.894736842105264,18.94736842105263,20.0
weights: 1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.1111111111111111,0.1111111111111111,0.1111111111111111,0.1111111111111111,0.1111111111111111,0.1111111111111111,0.1111111111111111,0.1111111111111111
                            WLS Regression Results
==============================================================================
Dep. Variable:                      y   R-squared:                       0.867
Model:                            WLS   Adj. R-squared:                  0.860
Method:                 Least Squares   F-statistic:                     117.3
Date:                Fri, 14 Oct 2022   Prob (F-statistic):           2.58e-09
Time:                        16:07:24   Log-Likelihood:                -27.696
No. Observations:                  20   AIC:                             59.39
Df Residuals:                      18   BIC:                             61.38
Df Model:                           1
Covariance Type:            nonrobust
==============================================================================
                 coef    std err          t      P>|t|      [0.025      0.975]
------------------------------------------------------------------------------
const          5.0730      0.324     15.650      0.000       4.392       5.754
x1             0.4450      0.041     10.832      0.000       0.359       0.531
==============================================================================
Omnibus:                        1.207   Durbin-Watson:                   1.502
Prob(Omnibus):                  0.547   Jarque-Bera (JB):                1.045
Skew:                          -0.380   Prob(JB):                        0.593
Kurtosis:                       2.177   Cond. No.                         14.1
==============================================================================
*/

// https://www.statsmodels.org/stable/examples/notebooks/generated/wls.html
function testWeightedLeastSquare() {
  // weights and response: same dimension
  const intercept = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];
  const x = [
    0.0, 1.0526315789473684, 2.1052631578947367, 3.1578947368421053,
    4.2105263157894735, 5.263157894736842, 6.315789473684211, 7.368421052631579,
    8.421052631578947, 9.473684210526315, 10.526315789473683,
    11.578947368421051, 12.631578947368421, 13.68421052631579,
    14.736842105263158, 15.789473684210526, 16.842105263157894,
    17.894736842105264, 18.94736842105263, 20.0,
  ];
  const predictors: matrix = [intercept, x];
  const response: arr1d = [
    3.8236908897147006, 5.0747303834465125, 6.355867411176375,
    6.397071283814187, 7.525434024796404, 7.68763992193726, 7.989687054915335,
    8.60134881977805, 9.597267883254144, 10.087387925664325, 9.26158825319585,
    10.227048374025388, 10.03735539202654, 11.5497486362428, 9.978466513812624,
    12.850257489991055, 10.169131742063438, 15.285895620477806,
    11.064395784378636, 10.192523264076709,
  ];
  const weights: arr1d = [
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
    0.1111111111111111, 0.1111111111111111, 0.1111111111111111,
    0.1111111111111111, 0.1111111111111111, 0.1111111111111111,
    0.1111111111111111, 0.1111111111111111,
  ];

  const val = MathHelper.weightedLeastSquare(predictors, response, weights);
  console.log("beta:", val["beta"]);
  console.log("yhat:", val["yhat"]);
  console.log("residual:", val["residual"]);

  const expected = [5.073, 0.445];
  assertEqFloatArr(MathJs.round(val["beta"]["_data"], 4), expected);
  drawGraph(x, response, "scatter", "WLS");
}

// Reference: https://github.com/yongjun21/loess
// https://mathjs.org/docs/reference/functions/mean.html
function runMathHelperTests() {
  // TODO: Start here, add tests for each function and fix the types

  testWeightFunction();
  testNormalization();
  testTranspose();
  testEuclideanDist();
  testDistMatrix();
  testWeightMatrix();

  testPolynomialExpansion();
  testWeightedLeastSquare();
}
