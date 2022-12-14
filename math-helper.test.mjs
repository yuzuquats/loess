import { assertEqFloat, Precision, assertEqFloatArr, assertEqFloatMatrix, } from "./assert.mjs";
import mathRs from "./math-wasm/pkg/math_wasm.js";
import { MathHelper } from "./math-helper.mjs";
import { MathJs } from "./mathjs.mjs";
function test(m) {
    const tests = {
        weightFunction: () => {
            assertEqFloat(m.weightFunc(2, 5, 3), 0.8200258559999998, Precision(-7));
            assertEqFloat(m.weightFunc(3, 5, 3), 0.48189030400000005, Precision(-7));
            assertEqFloat(m.weightFunc(4, 5, 3), 0.11621427199999991, Precision(-7));
            assertEqFloat(m.weightFunc(5, 5, 3), 0);
            assertEqFloat(m.weightFunc(7, 5, 3), 0);
            //should return (1-(d/dmax)^n)^n if d < dmax
            assertEqFloat(m.weightFunc(0.5, 1, 3), 0.669921875);
            assertEqFloat(m.weightFunc(0.5, 1, 2), 0.5625);
            //should return 0 if d >= dmax
            assertEqFloat(MathHelper.weightFunc(1, 1, 3), 0);
            assertEqFloat(MathHelper.weightFunc(1, 1, 2), 0);
        },
        normalize: () => {
            const assertNormalize = (refArray, expected, cutoff) => {
                const output = m.normalize(refArray)(refArray);
                assertEqFloatArr(output, expected, Precision(-10));
                assertEqFloat(MathJs.std(expected.slice(cutoff, expected.length - cutoff)), 1);
            };
            assertNormalize([8, 7, 6, 5, 4, 3, 2, 1], [
                4.27617987059879, 3.7416573867739413, 3.2071349029490928,
                2.6726124191242437, 2.138089935299395, 1.6035674514745464,
                1.0690449676496976, 0.5345224838248488,
            ], 1);
            assertNormalize([109, 8, 7, 6, 5, 4, 3, 2, 1, -100], [
                44.49906366056107, 3.2659863237109046, 2.8577380332470415,
                2.4494897427831783, 2.041241452319315, 1.6329931618554523,
                1.2247448713915892, 0.8164965809277261, 0.4082482904638631,
                -40.824829046386306,
            ], 1);
            assertNormalize([
                0.665, 0.701, 0.71, 0.767, 0.801, 0.807, 0.825, 0.831, 0.891, 0.902,
                0.928, 0.97, 0.973, 0.98, 0.997, 1.0, 1.021, 1.045, 1.074, 1.089,
                1.148, 1.224,
            ], [
                6.913967039455614, 7.2882569844487, 7.381829470696971,
                7.9744552169360245, 8.327951276096162, 8.39033293359501,
                8.577477906091552, 8.639859563590399, 9.263676138578877,
                9.378042510660096, 9.648363026488436, 10.08503462898037,
                10.116225457729794, 10.189004058145116, 10.365752087725184,
                10.396942916474607, 10.615278717720575, 10.864805347715965,
                11.16631669229373, 11.322270836040849, 11.935690468112849,
                12.72585812976492,
            ], 3);
        },
        transpose: () => {
            assertEqFloatMatrix(m.transpose([
                [1, 2, 3],
                [4, 5, 6],
            ]), [
                [1, 4],
                [2, 5],
                [3, 6],
            ]);
            assertEqFloatMatrix(m.transpose([
                [1, 2, 3, 4, 5],
                [6, 7, 8, 9, 10],
            ]), [
                [1, 6],
                [2, 7],
                [3, 8],
                [4, 9],
                [5, 10],
            ]);
        },
        euclideanDist: () => {
            assertEqFloat(m.euclideanDist([1, 2], [4, 6]), 5);
            assertEqFloat(MathJs.round(m.euclideanDist([1, 2, 3], [4, 5, 6]), 3), 5.196);
        },
        distMatrix: () => {
            assertEqFloatMatrix(MathHelper.distMatrix([[1, 1]], [[4, 5]]), [[5]]);
            assertEqFloatMatrix(MathHelper.distMatrix([
                [1, 1],
                [2, 2],
            ], [
                [4, 5],
                [5, 6],
            ]), [
                [5, 6.4031242374328485],
                [3.605551275463989, 5],
            ]);
            assertEqFloatMatrix(MathHelper.distMatrix([
                [1, 1],
                [4, 1],
                [4, 5],
            ], [
                [1, 1],
                [4, 1],
                [4, 5],
            ]), [
                [0, 3, 5],
                [3, 0, 4],
                [5, 4, 0],
            ]);
        },
        weightMatrix: () => {
            // span <= 1
            assertEqFloatMatrix(m.weightMatrix([[5, 4, 3, 2, 1]], [1, 1, 1, 1, 1], 0.6), [[0, 0, 0, 0.34847330183407, 0.8929533099629123]]);
            // span > 1
            assertEqFloatMatrix(m.weightMatrix([[5, 4, 3, 2, 1]], [1, 1, 1, 1, 1], 2), [
                [
                    0.669921875, 0.8200258559999998, 0.921167317, 0.976191488,
                    0.997002999,
                ],
            ]);
        },
        polynomialExpansion: () => { },
        weightedLeastSquare: () => { },
    };
    console.log("  TEST: weightFunction");
    tests.weightFunction();
    console.log("  TEST: normalize");
    tests.normalize();
    console.log("  TEST: transpose");
    tests.transpose();
    console.log("  TEST: euclideanDist");
    tests.euclideanDist();
    console.log("  TEST: distanceMatrix");
    tests.distMatrix();
    console.log("  TEST: weightMatrix");
    tests.weightMatrix();
}
console.log("Testing Original Library (MathHelper)");
test(MathHelper);
console.log("  PASSED");
console.log("_________________________________");
console.log("Testing Rust Library (MathHelper)");
test(mathRs);
console.log("  PASSED");
console.log(mathRs.transpose([
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
]));
