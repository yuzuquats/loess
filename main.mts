import { MathJs } from "./mathjs.mjs";
import type { matrix, arr1d } from "./mathjs.mjs";
import MathHelper from "./math-helper.mjs";
import { assertEqFloatArr, assertEqFloat } from "./assert.mjs";

function drawGraph(x: arr1d, y: arr1d, graph_type: string, title: string) {
  const data = {
    datasets: [
      {
        label: title,
        data: x.map(function (e, i) {
          return [e, y[i]];
        }),
        backgroundColor: "rgb(255, 99, 132)",
      },
    ],
  };

  const config = {
    //type: "scatter",
    type: graph_type,
    data,
    options: {
      animation: false,
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          ticks: {
            major: {
              enabled: true,
            },
            // // Include a dollar sign in the ticks
            // callback: function (value) {
            //   return `${DateTime.fromMillisecondsUTC(value)
            //     .toTimezoneOffset(420)
            //     .getReadableHourString()}`;
            // },
          },
        },
      },
    },
  };

  // @ts-ignore
  new Chart(document.getElementById("graph"), config);
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
function testWeightedLeastSquare(): {
  x: number[];
  y: number[];
} {
  console.log("ENTRY: testWeightedLeastSquare");
  //(1) case 1, 2, 3
  const caseOne = {
    x: [
      [1, 1, 1, 1],
      [1, 3, 5, 7],
    ],
    y: [14, 17, 19, 20],
    w: [1, 1, 1, 1],
    expect: {
      beta: MathJs.matrix([13.5, 1]),
      yhat: MathJs.matrix([14.5, 16.5, 18.5, 20.5]),
      residual: MathJs.matrix([-0.5, 0.5, 0.5, -0.5]),
    },
  };

  const caseTwo = {
    x: [
      [1, 1, 1, 1],
      [1, 3, 5, 7],
    ],
    y: [14, 17, 19, 20],
    w: [1, 3, 3, 1],
    expect: {
      beta: MathJs.matrix([13.75, 1]),
      yhat: MathJs.matrix([14.75, 16.75, 18.75, 20.75]),
      residual: MathJs.matrix([-0.75, 0.25, 0.25, -0.75]),
    },
  };

  const caseThree = {
    x: [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ],
    y: [14, 17, 19, 20],
    w: [1, 3, 3, 1],
  };

  // should return vector of fitted parameters (w/o weights)
  const fit1 = MathHelper.weightedLeastSquare(caseOne.x, caseOne.y, caseOne.w);
  assertEqFloatArr(fit1["beta"]._data, caseOne.expect["beta"]._data);
  assertEqFloatArr(fit1["yhat"]._data, caseOne.expect["yhat"]._data);
  assertEqFloatArr(fit1["residual"]._data, caseOne.expect["residual"]._data);

  // should return vector of fitted parameters (with weights)
  const fit2 = MathHelper.weightedLeastSquare(caseTwo.x, caseTwo.y, caseTwo.w);
  assertEqFloatArr(fit2["beta"]._data, caseTwo.expect["beta"]._data);
  assertEqFloatArr(fit2["yhat"]._data, caseTwo.expect["yhat"]._data);
  assertEqFloatArr(fit2["residual"]._data, caseTwo.expect["residual"]._data);

  // should return error object if x is non-invertible
  const fit3 = MathHelper.weightedLeastSquare(
    caseThree.x,
    caseThree.y,
    caseThree.w
  );
  console.log(fit3.error?.message);
  assertEqual(
    fit3.error?.message,
    "Cannot calculate inverse, determinant is zero"
  );

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

  console.log("EXIT: testWeightedLeastSquare");
  return {
    x,
    y: response,
  };
}

// 1) draw default scatter plot

// const GAS_DATA = {
//   NOx: [
//     1.561, 1.99, 2.118, 3.834, 4.602, 5.199, 4.255, 4.818, 5.064, 5.283, 5.344,
//     4.691, 5.055, 4.937, 3.752, 3.965, 3.275, 2.849, 2.286, 1.64, 0.97, 0.537,
//   ],
//   E: [
//     0.665, 0.701, 0.71, 0.767, 0.801, 0.807, 0.825, 0.831, 0.891, 0.902, 0.928,
//     0.97, 0.973, 0.98, 0.997, 1.0, 1.021, 1.045, 1.074, 1.089, 1.148, 1.224,
//   ],
// };
// drawGraph(GAS_DATA.NOx, GAS_DATA.E, "scatter", "test");

// 2) render least squares
const { x, y } = testWeightedLeastSquare();
drawGraph(x, y, "scatter", "WLS");
