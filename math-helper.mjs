import { MathJs } from "./math.mjs";
// MathHelper are custom math helper APIs we implement ourselves
// https://github.com/yongjun21/loess/blob/master/src/helpers.js
//
export default class MathHelper {
    /**
     * https://www.itl.nist.gov/div898/handbook/pmd/section1/pmd144.htm#:~:text=As%20mentioned%20above%2C%20the%20weight,points%20that%20are%20furthest%20away.
     * The weight for a specific point in any localized subset of data is
     * obtained by evaluating the weight function at the distance between
     * that point and the point of estimation, after scaling the distance
     * so that the maximum absolute distance over all of the points in the
     * subset of data is exactly one.
     * The formula: (1 - (d / dmax) ^ degree) ^ degree valid for d / dmax > 1
     * @param d: distance between that point and the point of estimation
     * @param dmax: the maximum absolute distance over all of the points
     * @param degree
     * @returns
     */
    static weightFunc(d, dmax, degree) {
        return d < dmax ? Math.pow(1 - Math.pow(d / dmax, degree), degree) : 0;
    }
    /**
     * Normalize an array such that its standard deviation is 1
     * @param referenceArr
     * @returns
     */
    static normalize(referenceArr) {
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
    static transpose(X) {
        const transposed = [];
        for (let i = 0; i < X[0].length; i++) {
            transposed.push(X.map((x) => x[i]));
        }
        return transposed;
    }
    /**
     * Find the Euclidean distance between orig and dest
     * d(p,q) = sqrt((p1-q1)^2 + (p2-q2)^2 + (p3-q3)^2 + .....)
     * @param orig
     * @param dest
     * @returns
     */
    static euclideanDist(orig, dest) {
        if (orig.length < 2) {
            return Math.abs(orig[0] - dest[0]);
        }
        else {
            return Math.sqrt(orig.reduce((acc, val, idx) => acc + Math.pow(val - dest[idx], 2), 0));
        }
    }
    /**
     * find the distance between two matrices
     * origSet = [arr1, arr2, arr3]
     * destSet = [brr1, brr2, brr3]
     * distanceMatrix = [dist(arr1, brr1), dist(arr1, brr2), dist(arr1, brr3)
     *                   dist(arr2, brr1), dist(arr2, brr2), dist(arr2, brr3)
     *                   dist(arr3, brr1), dist(arr3, brr2), dist(arr3, brr3)]
     * @param origSet
     * @param destSet
     * @returns
     */
    static distMatrix(origSet, destSet) {
        return origSet.map((orig) => destSet.map((dest) => MathHelper.euclideanDist(orig, dest)));
    }
    /**
     * TODO
     * @param distMat
     * @param inputWeights
     * @param bandwidth
     * @returns
     */
    static weightMatrix(distMat, inputWeights, bandwidth) {
        function zip(arrays) {
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
            const sorted = zip([distVect_copy, inputWeights_copy]).sort(([a1, a2], [b1, b2]) => a1 - b1);
            const cutoff = MathJs.sum(inputWeights) * bandwidth;
            let sumOfWeights = 0;
            let cutoffIndex = sorted.findIndex((v) => {
                sumOfWeights += v[1];
                return sumOfWeights >= cutoff;
            });
            let dmax = bandwidth > 1
                ? sorted[sorted.length - 1][0] * bandwidth
                : sorted[cutoffIndex][0];
            return MathJs.dotMultiply(distVect.map((d) => MathHelper.weightFunc(d, dmax, 3)), inputWeights);
        });
    }
    /**
     * TODO
     * @param factors
     * @param degree
     * @returns
     */
    static polynomialExpansion(factors, degree) {
        const expandedSet = [];
        let constTerm = 1;
        if (Array.isArray(factors[0]))
            constTerm = Array(factors[0].length).fill(1);
        function crossMultiply(accumulator, pointer, n) {
            if (n > 1) {
                for (let i = pointer; i < factors.length; i++) {
                    crossMultiply(MathJs.dotMultiply(accumulator, factors[i]), i, n - 1);
                }
            }
            else {
                expandedSet.push(accumulator);
            }
        }
        for (let d = 0; d <= degree; d++)
            crossMultiply(constTerm, 0, d + 1);
        return expandedSet;
    }
    /**
     * https://en.wikipedia.org/wiki/Weighted_least_squares
     *
     * @param predictors: X
     * @param response: y
     * @param weights: W
     * @returns
     */
    static weightedLeastSquare(predictors, response, weights) {
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
        }
        catch (err) {
            console.error(err);
            return { error: err };
        }
    }
}
