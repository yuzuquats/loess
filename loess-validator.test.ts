function drawGraph1(
  x: arr1d,
  y: arr1d,
  yhat: arr1d,
  upperLimit: arr1d,
  lowerLimit: arr1d,
  graph_type: string,
  title: string
) {
  const data = {
    datasets: [
      {
        label: "actual",
        data: x.map(function (e, i) {
          return [e, y[i]];
        }),
        backgroundColor: "black",
      },
      {
        label: "fitted",
        data: x.map(function (e, i) {
          return [e, yhat[i]];
        }),
        backgroundColor: "red",
      },
      {
        label: "upperLimit",
        data: x.map(function (e, i) {
          return [e, upperLimit[i]];
        }),
        backgroundColor: "blue",
      },
      {
        label: "lowerLimit",
        data: x.map(function (e, i) {
          return [e, lowerLimit[i]];
        }),
        backgroundColor: "green",
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
          },
        },
      },
    },
  };

  // @ts-ignore
  new Chart(document.getElementById("graph"), config);
}

function runLinearLoessTest() {
  const constants = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];
  const predictor = [
    0.0, 1.0526315789473684, 2.1052631578947367, 3.1578947368421053,
    4.2105263157894735, 5.263157894736842, 6.315789473684211, 7.368421052631579,
    8.421052631578947, 9.473684210526315, 10.526315789473683,
    11.578947368421051, 12.631578947368421, 13.68421052631579,
    14.736842105263158, 15.789473684210526, 16.842105263157894,
    17.894736842105264, 18.94736842105263, 20.0,
  ];

  const y: arr1d = [
    3.8236908897147006, 5.0747303834465125, 6.355867411176375,
    6.397071283814187, 7.525434024796404, 7.68763992193726, 7.989687054915335,
    8.60134881977805, 9.597267883254144, 10.087387925664325, 9.26158825319585,
    10.227048374025388, 10.03735539202654, 11.5497486362428, 9.978466513812624,
    12.850257489991055, 10.169131742063438, 15.285895620477806,
    11.064395784378636, 10.192523264076709,
  ];
  const w: arr1d = [
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
    0.1111111111111111, 0.1111111111111111, 0.1111111111111111,
    0.1111111111111111, 0.1111111111111111, 0.1111111111111111,
    0.1111111111111111, 0.1111111111111111,
  ];

  // case 1:
  var x = constants;
  var x2 = predictor;
  const data = { x, y, x2, w };
  console.log("Start");
  const model = new Loess(data, { span: 0.8, band: 0.8, degree: 1 });
  const output = model.train();
  console.log(JSON.stringify(output));
  console.log(
    "residual",
    output.residual._data,
    "size:",
    output.residual._size[0]
  );
  const test = output.residual._data.map((r) => r * r);
  const total: number = MathJs.sum(test);
  //output.residual._size[0]
  console.log("test:", test);
  console.log("total:", total);
  const mse = total / output.residual._size[0];
  console.log("mse:", mse);

  // case 2:
  x = predictor;
  const data1 = { x, y, w };
  const model1 = new Loess(data1, { span: 0.8, band: 0.8, degree: 1 });
  // polynomial expansion will automatically generate the constant array for intercept
  console.log("About to predict");
  const output1 = model1.predict();
  console.log("residuals:", output1.residuals);
  const square = output1.residuals.map((residual) =>
    residual._data.map((r) => r * r)
  );
  const mses = square.map((s) => MathJs.sum(s) / s.length);
  //console.log(JSON.stringify(output1));
  console.log("mses:", mses);
}

function runQuadraticLoessTest() {
  const data = {
    NOx: [
      1.561, 1.99, 2.118, 3.834, 4.602, 5.199, 4.255, 4.818, 5.064, 5.283,
      5.344, 4.691, 5.055, 4.937, 3.752, 3.965, 3.275, 2.849, 2.286, 1.64, 0.97,
      0.537,
    ],
    E: [
      0.665, 0.701, 0.71, 0.767, 0.801, 0.807, 0.825, 0.831, 0.891, 0.902,
      0.928, 0.97, 0.973, 0.98, 0.997, 1.0, 1.021, 1.045, 1.074, 1.089, 1.148,
      1.224,
    ],
  };

  const w = data.NOx.map(() => Math.random() * 10);
  const model = new Loess(
    { y: data.NOx, x: data.E, w },
    { span: 0.8, band: 0.8, degree: "quadratic" }
  );
  //const fit = model.predict(model.grid([30]));
  const fit = model.predict();
  console.log(JSON.stringify(fit));

  // console.log('residuals:', fit.residuals);
  const square = fit.residuals.map((residual) =>
    residual._data.map((r) => r * r)
  );
  const mses = square.map((s) => MathJs.sum(s) / s.length);
  //console.log(JSON.stringify(output1));
  console.log("mses:", mses);

  var upperLimit = fit.fitted.map((yhat, idx) => yhat + fit.halfwidth[idx]);
  var lowerLimit = fit.fitted.map((yhat, idx) => yhat - fit.halfwidth[idx]);

  // plot upperLimit and lowerLimit
  console.log("x:", data.E);
  console.log("y:", data.NOx);
  console.log("yhat:", fit.fitted);
  console.log("upperLimit:", upperLimit);
  console.log("lowerLimit:", lowerLimit);
  drawGraph1(
    data.E,
    data.NOx,
    fit.fitted,
    upperLimit,
    lowerLimit,
    "scatter",
    "WLS"
  );
}
