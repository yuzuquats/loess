"use strict";
const GAS_DATA = {
    NOx: [
        1.561, 1.99, 2.118, 3.834, 4.602, 5.199, 4.255, 4.818, 5.064, 5.283, 5.344,
        4.691, 5.055, 4.937, 3.752, 3.965, 3.275, 2.849, 2.286, 1.64, 0.97, 0.537,
    ],
    E: [
        0.665, 0.701, 0.71, 0.767, 0.801, 0.807, 0.825, 0.831, 0.891, 0.902, 0.928,
        0.97, 0.973, 0.98, 0.997, 1.0, 1.021, 1.045, 1.074, 1.089, 1.148, 1.224,
    ],
};
async function drawGraph() {
    const data = {
        datasets: [
            {
                label: "Gas",
                data: GAS_DATA.NOx.map(function (e, i) {
                    return [e, GAS_DATA.E[i]];
                }),
                backgroundColor: "rgb(255, 99, 132)",
            },
        ],
    };
    const model = new Loess({
        x: GAS_DATA.NOx,
        y: GAS_DATA.E,
    });
    console.log(model);
    const config = {
        type: "scatter",
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
function assert(test, message) {
    if (!test) {
        console.error(message);
    }
}
function runMathHelperTests() {
    // TODO: Start here, add tests for each function and fix the types
    {
        const res = MathHelper.weightFunc(1, 5, 5);
        console.log(res);
        assert(false, "MathHelper.weightFunc failed!");
    }
    // MathHelper.normalize()
    // MathHelper.transpose()
    // MathHelper.euclideanDist()
    // MathHelper.distMatrix()
    // MathHelper.weightMatrix()
    // MathHelper.polynomialExpansion()
    // MathHelper.weightedLeastSquare()
}
async function main() {
    await drawGraph();
    runMathHelperTests();
}
main();
