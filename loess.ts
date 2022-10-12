const MathJs: {
  std: <T>(
    array: Array<T>,
    normalization?: "unbiased" | "uncorrected" | "biased"
  ) => T;
  dotMultiply: <T>(t: T) => T;
  sum: <T>(array: Array<T>) => T;
} =
  // @ts-ignore
  math;

type matrix = Array<Array<number>>;
type arr1d = Array<number>;
type Arr1ToArr1 = (i: arr1d) => arr1d;

class MathHelper {
  static weightFunc(d: number, dmax: number, degree: number): number {
    return d < dmax ? Math.pow(1 - Math.pow(d / dmax, degree), degree) : 0;
  }

  static normalize(referenceArr: arr1d): Arr1ToArr1 {
    const cutoff = Math.ceil(0.1 * referenceArr.length);
    const trimmed_arr = referenceArr
      .sort()
      .slice(cutoff, referenceArr.length - cutoff);
    const sd = MathJs.std(trimmed_arr);
    return function (outputArr) {
      return outputArr.map((val) => val / sd);
    };
  }

  static transpose(X: Array<Array<number>>): Array<Array<number>> {
    const transposed: Array<Array<number>> = [];
    for (let i = 0; i < X[0].length; i++) {
      transposed.push(X.map((x) => x[i]));
    }
    return transposed;
  }

  static euclideanDist(orig: arr1d, dest: arr1d) {
    if (orig.length < 2) {
      return Math.abs(orig[0] - dest[0]);
    } else {
      return Math.sqrt(
        orig.reduce((acc, val, idx) => acc + Math.pow(val - dest[idx], 2), 0)
      );
    }
  }

  static distMatrix(origSet: matrix, destSet: matrix) {
    return origSet.map((orig) =>
      destSet.map((dest) => MathHelper.euclideanDist(orig, dest))
    );
  }

  static weightMatrix(distMat: matrix, inputWeights: arr1d, bandwidth: number) {
    return distMat.map((distVect) => {
      const sorted = zip(distVect, inputWeights).sort((v) => v[0]);
      const cutoff = MathJs.sum(inputWeights) * bandwidth;
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

  static polynomialExpansion(factors: matrix, degree): arr1d {
    const expandedSet: arr1d = [];
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

  static weightedLeastSquare(predictors, response, weights) {
    try {
      const weightedY = MathHelper.matrix(
        MathHelper.dotMultiply(weights, response)
      );
      const weightedX = MathHelper.transpose(
        math.matrix(
          predictors.map((x) => {
            return math.dotMultiply(weights, x);
          })
        )
      );
      const LHS = math.multiply(predictors, weightedX);
      const RHS = math.multiply(predictors, weightedY);
      const beta = math.multiply(math.inv(LHS), RHS);
      const yhat = math.squeeze(math.multiply(beta, predictors));
      const residual = math.subtract(response, yhat);
      return { beta, yhat, residual };
    } catch (err) {
      return { error: err };
    }
  }
}

type LoessOptions = {
  span: number; // 0 to inf, default 0.75
  band: number; // 0 to 1, default 0
  // degree: [0, 1, 2] || ['constant', 'linear', 'quadratic'], // default 2
  degree: 0 | 1 | 2 | "constant" | "linear" | "quadratic";
  normalize?: boolean; // default true if degree > 1, false otherwise
  robust: boolean; // default false
  iterations?: number; //default 4 if robust = true, 1 otherwise
};

class Loess {
  options: LoessOptions;
  x: Array<Array<number>>;

  constructor(
    data: {
      x: Array<number>;
      y: Array<number>;
      x2?: Array<number>;
      w?: Array<number>;
    },
    options: LoessOptions = {
      span: 0.75,
      band: 0,
      degree: 2,
      robust: false,
    }
  ) {
    this.options = options;

    const model = validateModel(data, options);
    this.x = model.x;

    if (this.options.normalize)
      this.normalization = this.x.map(MathHelper.normalize);

    this.expandedX = MathHelper.polynomialExpansion(
      this.x,
      this.options.degree
    );
    const normalized = this.normalization
      ? this.x.map((x, idx) => this.normalization[idx](x))
      : this.x;
    this.transposedX = MathHelper.transpose(normalized);
  }

  predict(data: { x: Array<number>; x2: Array<number> }): {
    fitted: Array<number>;
    halfwidth: Array<number>;
  } {
    const { x_new, n } = validatePredict.bind(this)(data);

    const expandedX = MathHelper.polynomialExpansion(
      x_new,
      this.options.degree
    );
    const normalized = this.normalization
      ? x_new.map((x, idx) => this.normalization[idx](x))
      : x_new;
    const distM = MathHelper.distMatrix(
      transpose(normalized),
      this.transposedX
    );
    const weightM = MathHelper.weightMatrix(distM, this.w, this.bandwidth);

    let fitted, residuals, weights, betas;
    function iterate(wt) {
      fitted = [];
      residuals = [];
      betas = [];
      weights = math.dotMultiply(wt, weightM);
      MathHelper.transpose(expandedX).forEach((point, idx) => {
        const fit = weightedLeastSquare(this.expandedX, this.y, weights[idx]);
        if (fit.error) {
          const sumWeights = math.sum(weights[idx]);
          const mle =
            sumWeights === 0
              ? 0
              : math.multiply(this.y, weights[idx]) / sumWeights;
          fit.beta = math.zeros(this.expandedX.length).set([0], mle);
          fit.residual = math.subtract(this.y, mle);
        }
        fitted.push(math.squeeze(math.multiply(point, fit.beta)));
        residuals.push(fit.residual);
        betas.push(fit.beta.toArray());
        const median = math.median(math.abs(fit.residual));
        wt[idx] = fit.residual.map((r) => weightFunc(r, 6 * median, 2));
      });
    }

    const robustWeights = Array(n).fill(math.ones(this.n));
    for (let iter = 0; iter < this.options.iterations; iter++)
      iterate.bind(this)(robustWeights);

    const output = { fitted, betas, weights };

    if (this.options.band) {
      const z = gaussian(0, 1).ppf(1 - (1 - this.options.band) / 2);
      const halfwidth = weights.map((weight, idx) => {
        const V1 = math.sum(weight);
        const V2 = math.multiply(weight, weight);
        const intervalEstimate = Math.sqrt(
          math.multiply(math.square(residuals[idx]), weight) / (V1 - V2 / V1)
        );
        return intervalEstimate * z;
      });
      Object.assign(output, { halfwidth });
    }

    return output;
  }

  grid(cuts) {
    validateGrid.bind(this)(cuts);

    const x_new = [];
    const x_cuts = [];
    this.x.forEach((x, idx) => {
      const x_sorted = sort(x);
      const x_min = x_sorted[0];
      const x_max = x_sorted[this.n - 1];
      const width = (x_max - x_min) / (cuts[idx] - 1);
      x_cuts.push([]);
      for (let i = 0; i < cuts[idx]; i++) x_cuts[idx].push(x_min + i * width);

      let repeats = 1;
      let copies = 1;
      for (let i = idx - 1; i >= 0; i--) repeats *= cuts[i];
      for (let i = idx + 1; i < this.d; i++) copies *= cuts[i];

      x_new.push([]);
      for (let i = 0; i < repeats; i++) {
        x_new[idx] = x_new[idx].concat(
          x_cuts[idx].reduce(
            (acc, cut) => acc.concat(Array(copies).fill(cut)),
            []
          )
        );
      }
    });

    const data = { x: x_new[0], x_cut: x_cuts[0] };
    if (this.d > 1) Object.assign(data, { x2: x_new[1], x_cut2: x_cuts[1] });
    return data;
  }
}

function validateIsArray(target, msg) {
  if (!Array.isArray(target)) throw new Error(msg);
}

function validateIsNumber(target, msg) {
  if (typeof target !== "number") throw new Error(msg);
}

function validateIsInteger(target, msg) {
  validateIsNumber(target, msg);
  if (target - Math.floor(target) > 0) throw new Error(msg);
}

function validateModel(
  data: {
    x: Array<number>;
    y: Array<number>;
    x2?: Array<number>;
    w?: Array<number>;
  },
  options
) {
  if (!data) throw new Error("no data passed in to constructor");
  if (typeof data !== "object")
    throw new Error("no data passed in to constructor");
  let { y, x, x2, w } = data;

  validateIsArray(y, "Invalid type: y should be an array");
  validateIsArray(x, "Invalid type: x should be an array");

  y.forEach((v) =>
    validateIsNumber(v, "Invalid type: y should include only numbers")
  );
  x.forEach((v) =>
    validateIsNumber(v, "Invalid type: x should include only numbers")
  );

  const n = y.length;
  if (x.length !== n) throw new Error("y and x have different length");
  const x_and_x2 = [x];

  if (x2) {
    validateIsArray(x2, "Invalid type: x2 should be an array");
    x2.forEach((v) =>
      validateIsNumber(v, "Invalid type: x2 should include only numbers")
    );
    if (x2.length !== n) throw new Error("y and x2 have different length");
    x_and_x2.push(x2);
  }

  if (w) {
    validateIsArray(w, "Invalid type: w should be an array");
    w.forEach((v) =>
      validateIsNumber(v, "Invalid type: w should include only numbers")
    );
    if (w.length !== n) throw new Error("y and w have different length");
  } else {
    w = Array(n).fill(1);
  }

  if (!options || typeof options !== "object")
    throw new Error("Invalid type: options should be passed in as an object");
  options = Object.assign(
    {
      span: 0.75,
      band: 0,
      degree: 2,
      normalize: true,
      robust: false,
      iterations: 4,
    },
    options
  );

  if (typeof options.degree === "string") {
    options.degree = ["constant", "linear", "quadratic"].indexOf(
      options.degree
    );
  }
  validateIsNumber(
    options.span,
    "Invalid type: options.span should be a number"
  );
  if (options.span <= 0)
    throw new Error("options.span should be greater than 0");

  validateIsNumber(
    options.band,
    "Invalid type: options.band should be a number"
  );
  if (options.band < 0 || options.band > 0.99)
    throw new Error("options.band should be between 0 and 1");

  validateIsInteger(
    options.degree,
    "Invalid type: options.degree should be an integer"
  );
  if (options.degree < 0 || options.degree > 2)
    throw new Error("options.degree should be between 0 and 2");

  if (typeof options.normalize !== "boolean")
    throw new Error("Invalid type: options.normalize should be a boolean");
  if (typeof options.robust !== "boolean")
    throw new Error("Invalid type: options.robust should be a boolean");

  validateIsInteger(
    options.iterations,
    "Invalid type: options.iterations should be an integer"
  );
  if (options.iterations < 1)
    throw new Error("options.iterations should be at least 1");
  if (!options.robust) options.iterations = 1;

  const d = x2 ? 2 : 1;
  const bandwidth =
    options.span > 1 ? Math.pow(options.span, 1 / d) : options.span;

  return { y, x: x_and_x2, w, n, d, options, bandwidth };
}

function validatePredict(data) {
  if (!data) data = { x: this.x[0], x2: this.x[1] };
  if (typeof data !== "object")
    throw new Error("Invalid type: data should be supplied as an object");

  let { x, x2 = null } = data;

  validateIsArray(x, "Invalid type: x should be an array");
  x.forEach((v) =>
    validateIsNumber(v, "Invalid type: x should include only numbers")
  );

  const x_new = [x];
  const n = x.length;

  if (this.d > 1) {
    validateIsArray(x2, "Invalid type: x2 should be an array");
    x2.forEach((v) =>
      validateIsNumber(v, "Invalid type: x2 should include only numbers")
    );
    if (x2.length !== n) throw new Error("x and x2 have different length");
    x_new.push(x2);
  } else if (x2) {
    throw new Error("extra variable x2");
  }
  return { x_new, n };
}

function validateGrid(cuts) {
  validateIsArray(cuts, "Invalid type: cuts should be an array");
  cuts.forEach((cut) => {
    validateIsInteger(cut, "Invalid type: cuts should include only integers");
    if (cuts < 3) throw new Error("cuts should include only integers > 2");
  });
  if (cuts.length !== this.d)
    throw new Error("cuts.length should match dimension of predictors");
}
