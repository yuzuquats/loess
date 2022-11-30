window.assert = (test: boolean, message: string) => {
  if (!test) {
    console.error(message);
  }
};

window.assertEqual = (a: any, b: any, message?: string) => {
  if (a != b) {
    if (message) {
      console.error(`'${a}' != '${b}'`);
    } else {
      console.error(`'${a}' != '${b}'`, message);
    }
  }
};

window.assertEqFloat = (a: number, b: number, message?: string) => {
  if (Math.abs(a - b) > Number.EPSILON) {
    if (message) {
      console.error(`'${a}' != '${b}'`);
    } else {
      console.error(`'${a}' != '${b}'`, message);
    }
  }
};
window.assertEqFloatArr = (a: arr1d, b: arr1d, message?: string) => {
  function zip(arrays: [arr1d, arr1d]) {
    return arrays[0].map(function (_, i) {
      return arrays.map(function (array) {
        return array[i];
      });
    });
  }

  const zipped = zip([a, b]);
  zipped.forEach((e) => assertEqFloat(e[0], e[1], message));
};
