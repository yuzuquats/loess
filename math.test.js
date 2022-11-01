"use strict";
function testWeightFunction__(d, dmax, degree, expected) {
    const actual = MathHelper.weightFunc(d, dmax, degree);
    assertEqFloat(actual, expected);
}
function testWeightFunction() {
    console.log('ENTRY: testWeightFunc');
    testWeightFunction__(2, 5, 3, 0.8200258559999998);
    testWeightFunction__(3, 5, 3, 0.48189030400000005);
    testWeightFunction__(4, 5, 3, 0.11621427199999991);
    testWeightFunction__(5, 5, 3, 0);
    testWeightFunction__(7, 5, 3, 0);
    //should return (1-(d/dmax)^n)^n if d < dmax
    const v1 = MathHelper.weightFunc(0.5, 1, 3);
    assertEqFloat(MathHelper.weightFunc(0.5, 1, 3), 0.669921875);
    assertEqFloat(MathHelper.weightFunc(0.5, 1, 2), 0.5625);
    //should return 0 if d >= dmax
    assertEqFloat(MathHelper.weightFunc(1, 1, 3), 0);
    assertEqFloat(MathHelper.weightFunc(1, 1, 2), 0);
    console.log('EXIT: testWeightFunc');
}
function testNormalization() {
    console.log('ENTRY: testNormalize');
    const caseOne = {
        test: [109, 8, 7, 6, 5, 4, 3, 2, 1, -100],
        expect: [44.499, 3.266, 2.858, 2.449, 2.041, 1.633, 1.225, 0.816, 0.408, -40.825]
    };
    // should return array divided by 10% trimmed sample deviation
    const normalizedArr = MathHelper.normalize(caseOne.test)(caseOne.test);
    const val = MathJs.round(normalizedArr, 3);
    assertEqFloatArr(val, caseOne.expect);
    console.log('EXIT: testNormalize');
}
function testTranspose() {
    console.log('ENTRY: testTranspose');
    const y = MathHelper.transpose([
        [1, 2, 3],
        [4, 5, 6],
    ]);
    assertEqFloatArr(y[0], [1, 4]);
    assertEqFloatArr(y[1], [2, 5]);
    assertEqFloatArr(y[2], [3, 6]);
    const caseOne = {
        test: [
            [1, 2, 3, 4, 5],
            [6, 7, 8, 9, 10]
        ],
        expect: [
            [1, 6],
            [2, 7],
            [3, 8],
            [4, 9],
            [5, 10]
        ]
    };
    // should return transposed matrix'
    const actual = MathHelper.transpose(caseOne.test);
    assertEqFloatArr(actual[0], caseOne.expect[0]);
    assertEqFloatArr(actual[1], caseOne.expect[1]);
    assertEqFloatArr(actual[2], caseOne.expect[2]);
    assertEqFloatArr(actual[3], caseOne.expect[3]);
    assertEqFloatArr(actual[4], caseOne.expect[4]);
    console.log('EXIT: testTranspose');
}
function testEuclideanDist() {
    console.log('ENTRY: testEuclideanDist');
    const orig = [1, 2];
    const dest = [4, 6];
    const y = MathHelper.euclideanDist(orig, dest);
    assertEqFloat(y, 5);
    // should return Euclidean distance between two vectors
    assertEqFloat(MathJs.round(MathHelper.euclideanDist([1, 2, 3], [4, 5, 6]), 3), 5.196);
    console.log('EXIT: testEuclideanDist');
}
function testDistMatrix() {
    console.log('ENTRY: testDistMatrix');
    const origSet = [[1, 1]];
    const destSet = [[4, 5]];
    const val = MathHelper.distMatrix(origSet, destSet);
    assertEqFloatArr(val[0], [5]);
    const origSet1 = [
        [1, 1],
        [2, 2],
    ];
    const destSet1 = [
        [4, 5],
        [5, 6],
    ];
    const val1 = MathHelper.distMatrix(origSet1, destSet1);
    // distance between [1,1] and [4,5], distance between[1,1] and [5,6]
    assertEqFloatArr(val1[0], [5, 6.4031242374328485]);
    // distance between[2,2] and [4,5],  distance between[2,2] and [5,6]
    assertEqFloatArr(val1[1], [3.605551275463989, 5]);
    const caseOne = {
        coordinates: [
            [1, 1],
            [4, 1],
            [4, 5]
        ],
        expect: [
            [0, 3, 5],
            [3, 0, 4],
            [5, 4, 0]
        ]
    };
    // should return matrix of Euclidean distance between pairs of points
    const actual = MathHelper.distMatrix(caseOne.coordinates, caseOne.coordinates);
    assertEqFloatArr(actual[0], caseOne.expect[0]);
    assertEqFloatArr(actual[1], caseOne.expect[1]);
    assertEqFloatArr(actual[2], caseOne.expect[2]);
    console.log('EXIT: testDistMatrix');
}
function testWeightMatrix() {
    console.log('ENTRY: testWeightMatrix');
    const distMat1 = [
        [1, 2, 3],
        [4, 5, 6],
    ];
    const inputWeights = [5, 10, 15];
    const bandwidth = 3;
    const val = MathHelper.weightMatrix(distMat1, inputWeights, bandwidth);
    console.log(val);
    const distMat = [
        [5, 4, 3, 2, 1]
    ];
    const caseOne = {
        inputWeights: [1, 1, 1, 1, 1],
        bandwidth: 0.6,
        expect: [
            [0, 0, 0, 0.348, 0.893]
        ]
    };
    const caseTwo = {
        inputWeights: [1, 1, 1, 1, 1],
        bandwidth: 2,
        expect: [
            [0.67, 0.82, 0.921, 0.976, 0.997]
        ]
    };
    // span <= 1
    const actual = MathHelper.weightMatrix(distMat, caseOne.inputWeights, caseOne.bandwidth);
    actual[0] = MathJs.round(actual[0], 3);
    assertEqFloatArr(actual[0], caseOne.expect[0]);
    // span > 1
    const actual2 = MathHelper.weightMatrix(distMat, caseTwo.inputWeights, caseTwo.bandwidth);
    actual2[0] = MathJs.round(actual2[0], 3);
    assertEqFloatArr(actual2[0], caseTwo.expect[0]);
    console.log('EXIT: testWeightMatrix');
}
function testPolynomialExpansion() {
    console.log('ENTRY: testPolynomialExpansion');
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
    const actual4 = MathHelper.polynomialExpansion([[1, 2], [3, 4]], 2);
    // [[1, 1], [1, 2], [3, 4], [1, 4], [3, 8], [9, 16]]);
    assertEqFloatArr(actual4[0], [1, 1]);
    assertEqFloatArr(actual4[1], [1, 2]);
    assertEqFloatArr(actual4[2], [3, 4]);
    assertEqFloatArr(actual4[3], [1, 4]);
    assertEqFloatArr(actual4[4], [3, 8]);
    assertEqFloatArr(actual4[5], [9, 16]);
    const factors = [
        [1, 2, 3],
        [4, 5, 6],
    ];
    const degree = 4;
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
    console.log('EXIT: testPolynomialExpansion');
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
    console.log('ENTRY: testWeightedLeastSquare');
    //(1) case 1, 2, 3
    const caseOne = {
        x: [
            [1, 1, 1, 1],
            [1, 3, 5, 7]
        ],
        y: [14, 17, 19, 20],
        w: [1, 1, 1, 1],
        expect: {
            beta: MathJs.matrix([13.5, 1]),
            yhat: MathJs.matrix([14.5, 16.5, 18.5, 20.5]),
            residual: MathJs.matrix([-0.5, 0.5, 0.5, -0.5])
        }
    };
    const caseTwo = {
        x: [
            [1, 1, 1, 1],
            [1, 3, 5, 7]
        ],
        y: [14, 17, 19, 20],
        w: [1, 3, 3, 1],
        expect: {
            beta: MathJs.matrix([13.75, 1]),
            yhat: MathJs.matrix([14.75, 16.75, 18.75, 20.75]),
            residual: MathJs.matrix([-0.75, 0.25, 0.25, -0.75])
        }
    };
    const caseThree = {
        x: [
            [1, 1, 1, 1],
            [1, 1, 1, 1]
        ],
        y: [14, 17, 19, 20],
        w: [1, 3, 3, 1]
    };
    // should return vector of fitted parameters (w/o weights)
    const fit1 = MathHelper.weightedLeastSquare(caseOne.x, caseOne.y, caseOne.w);
    assertEqFloatArr(fit1['beta']._data, caseOne.expect['beta']._data);
    assertEqFloatArr(fit1['yhat']._data, caseOne.expect['yhat']._data);
    assertEqFloatArr(fit1['residual']._data, caseOne.expect['residual']._data);
    // should return vector of fitted parameters (with weights)
    const fit2 = MathHelper.weightedLeastSquare(caseTwo.x, caseTwo.y, caseTwo.w);
    assertEqFloatArr(fit2['beta']._data, caseTwo.expect['beta']._data);
    assertEqFloatArr(fit2['yhat']._data, caseTwo.expect['yhat']._data);
    assertEqFloatArr(fit2['residual']._data, caseTwo.expect['residual']._data);
    // should return error object if x is non-invertible
    const fit3 = MathHelper.weightedLeastSquare(caseThree.x, caseThree.y, caseThree.w);
    console.log(fit3['error'].message);
    assertEqual(fit3['error'].message, 'Cannot calculate inverse, determinant is zero');
    // case 4
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
    const predictors = [intercept, x];
    const response = [
        3.8236908897147006, 5.0747303834465125, 6.355867411176375,
        6.397071283814187, 7.525434024796404, 7.68763992193726, 7.989687054915335,
        8.60134881977805, 9.597267883254144, 10.087387925664325, 9.26158825319585,
        10.227048374025388, 10.03735539202654, 11.5497486362428, 9.978466513812624,
        12.850257489991055, 10.169131742063438, 15.285895620477806,
        11.064395784378636, 10.192523264076709,
    ];
    const weights = [
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
    console.log('EXIT: testWeightedLeastSquare');
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
