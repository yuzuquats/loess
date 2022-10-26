"use strict";
const assert = (window["assert"] = (test, message) => {
    if (!test) {
        console.error(message);
    }
});
const assertEqual = (window["assertEqual"] = (a, b, message) => {
    if (a != b) {
        if (message) {
            console.error(`'${a}' != '${b}'`);
        }
        else {
            console.error(`'${a}' != '${b}'`, message);
        }
    }
});
const assertEqFloat = (window["assertEqFloat"] = (a, b, message) => {
    if (Math.abs(a - b) > Number.EPSILON) {
        if (message) {
            console.error(`'${a}' != '${b}'`);
        }
        else {
            console.error(`'${a}' != '${b}'`, message);
        }
    }
});
const assertEqFloatArr = (window["assertEqFloatArr"] = (a, b, message) => {
    function zip(arrays) {
        return arrays[0].map(function (_, i) {
            return arrays.map(function (array) {
                return array[i];
            });
        });
    }
    const zipped = zip([a, b]);
    zipped.forEach((e) => assertEqFloat(e[0], e[1], message));
});
