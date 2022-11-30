"use strict";
class Loess {
    constructor(data, options = {
        span: 0.75,
        band: 0,
        degree: 2,
        robust: false,
    }) {
        this.options = options;
        const model = validateModel(data, options);
        this.x = model.x;
        this.y = model.y;
        this.w = model.w;
        this.n = model.n;
        this.d = model.d;
        this.bandwidth = model.bandwidth;
        this.degree =
            typeof this.options.degree === "string"
                ? ["constant", "linear", "quadratic"].indexOf(this.options.degree)
                : this.options.degree;
        if (!this.options.normalize) {
            this.options.normalize = this.degree > 1 ? true : false;
        }
        // generate normalization function with fixed standard deviation
        if (this.options.normalize)
            this.normalization = this.x.map(MathHelper.normalize);
        this.expandedX = MathHelper.polynomialExpansion(this.x, this.degree);
        const normalized = this.normalization
            ? this.x.map((x, idx) => this.normalization[idx](x))
            : this.x;
        this.transposedX = MathHelper.transpose(normalized);
    }
    train() {
        const fit = MathHelper.weightedLeastSquare(this.x, this.y, this.w);
        return fit;
    }
    /**
     * https://towardsdatascience.com/iterated-reweighted-least-squares-and-glms-explained-9c0cc0063526
     * Iterated Reweighted Least Squares
     * @param data
     * @returns
     */
    predict(data) {
        const { x_new, n } = validatePredict.bind(this)(data);
        const newExpandedX = MathHelper.polynomialExpansion(x_new, this.degree);
        // compute normalized x_new using the same normaliztion function generated using x
        const newNormalized = this.normalization
            ? x_new.map((x, idx) => this.normalization[idx](x))
            : x_new;
        const newTransposedX = MathHelper.transpose(newNormalized);
        // compute the distance between x and x_new
        const distM = MathHelper.distMatrix(newTransposedX, this.transposedX);
        const weightM = MathHelper.weightMatrix(distM, this.w, this.bandwidth);
        const thisExpandedX = this.expandedX;
        const thisY = this.y;
        const thisN = this.n;
        //let fitted: any[], residuals: any[], weights: any[], betas: any[];
        var fitted = [];
        var residuals = [];
        var weights = [];
        var betas = [];
        function iterate(wt) {
            weights = MathJs.dotMultiply(wt, weightM);
            MathHelper.transpose(newExpandedX).forEach((point, idx) => {
                const fit = MathHelper.weightedLeastSquare(thisExpandedX, thisY, weights[idx]);
                if (fit.error) {
                    // predict future y as the weighted average of historical y value, independent of X
                    const sumWeights = MathJs.sum(weights[idx]);
                    // mle: maximum likelihood estimation: weighted average of Y
                    const mle = sumWeights === 0
                        ? 0
                        : MathJs.multiply(thisY, weights[idx]) / sumWeights;
                    // y = aX + b where a = 0, b = mle
                    //fit.beta = MathJs.zeros(thisExpandedX.length).set([0], mle);
                    fit.beta = MathJs.zeros(thisExpandedX.length);
                    fit.beta._data[0] = mle;
                    //fit.residual = MathJs.subtract(thisY, mle);
                    fit.residual = thisY.map((e) => e - mle);
                }
                fitted.push(MathJs.squeeze(MathJs.multiply(point, fit.beta)));
                residuals.push(fit.residual);
                betas.push(fit.beta.toArray());
                const median = MathJs.median(MathJs.abs(fit.residual));
                wt[idx] = fit.residual.map((r) => MathHelper.weightFunc(r, 6 * median, 2));
            });
        }
        //const robustWeights = MathJs.ones(n, thisN);
        const robustWeights = Array(n).fill(MathJs.ones(thisN));
        var iterations;
        if (this.options.iterations)
            iterations = this.options.iterations;
        else
            iterations = this.options.robust == true ? 4 : 1;
        for (let iter = 0; iter < iterations; iter++)
            iterate.bind(this)(robustWeights);
        const output = { fitted, betas, residuals, weights };
        if (this.options.band) {
            const z = gaussian(0, 1).ppf(1 - (1 - this.options.band) / 2);
            const halfwidth = weights.map((weight, idx) => {
                const V1 = MathJs.sum(weight);
                const V2 = MathJs.multiply(weight, weight);
                //const intervalEstimate = Math.sqrt(
                //  MathJs.multiply(MathJs.square(residuals[idx]), weight) / (V1 - V2 / V1)
                //);
                const intervalEstimate = Math.sqrt(MathJs.multiply(residuals[idx].map((r) => MathJs.square(r)), weight) /
                    (V1 - V2 / V1));
                return intervalEstimate * z;
            });
            Object.assign(output, { halfwidth });
        }
        return output;
    }
    /**
     *
     * @param cuts
     * @returns
     */
    grid(cuts) {
        validateGrid.bind(this)(cuts);
        const x_new = [];
        const x_cuts = [];
        this.x.forEach((x, idx) => {
            const x_sorted = MathJs.sort(x);
            const x_min = x_sorted[0];
            const x_max = x_sorted[this.n - 1];
            const width = (x_max - x_min) / (cuts[idx] - 1);
            x_cuts.push([]);
            for (let i = 0; i < cuts[idx]; i++)
                x_cuts[idx].push(x_min + i * width);
            let repeats = 1;
            let copies = 1;
            for (let i = idx - 1; i >= 0; i--)
                repeats *= cuts[i];
            for (let i = idx + 1; i < this.d; i++)
                copies *= cuts[i];
            x_new.push([]);
            for (let i = 0; i < repeats; i++) {
                x_new[idx] = x_new[idx].concat(x_cuts[idx].reduce((acc, cut) => acc.concat(Array(copies).fill(cut)), []));
            }
        });
        const data = { x: x_new[0], x_cut: x_cuts[0] };
        if (this.d > 1)
            Object.assign(data, { x2: x_new[1], x_cut2: x_cuts[1] });
        return data;
    }
}
