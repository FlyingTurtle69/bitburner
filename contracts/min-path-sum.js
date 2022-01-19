// Minimum Path Sum in a Triangle

const assert = require("assert");

function minPathSumTriangle(arr2d) {
    function sum2(vi = 1, hi = 0, sum = arr2d[0][0]) {
        const row = arr2d[vi];
        let left = row[hi];
        let right = row[hi + 1];

        if (vi !== arr2d.length - 1) {
            left = sum2(vi + 1, hi, sum + left);
            right = sum2(vi + 1, hi + 1, sum + right);
            sum = 0;
        }
        return sum + Math.min(left, right);
    }
    return sum2();
}

assert(minPathSumTriangle([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]) === 11);

console.log(
    minPathSumTriangle([
        [2],
        [1, 7],
        [6, 4, 9],
        [4, 1, 6, 6],
        [3, 4, 3, 3, 3],
        [5, 8, 4, 9, 4, 4],
        [9, 2, 4, 8, 8, 5, 2],
        [1, 4, 1, 1, 3, 3, 5, 9],
        [4, 1, 2, 8, 4, 6, 5, 7, 9],
        [5, 7, 1, 4, 6, 1, 8, 2, 2, 8],
        [2, 9, 5, 4, 4, 4, 8, 5, 4, 7, 4],
    ])
);
