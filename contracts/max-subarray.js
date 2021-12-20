// contract-923351-Netburners on hong-fang-tea

/**
 * @param {number[]} arr
 */
function subarrayWithMaximumSum(arr) {
    let maxN = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length + 1; j++) {
            const nArr = arr.slice(i, j);
            const nMax = nArr.reduce((a, b) => a + b);
            if (nMax > maxN) maxN = nMax;
        }
    }
    return maxN;
}

const answer = subarrayWithMaximumSum([
    -5, 10, 1, 3, -2, 6, 0, 1, 10, 5, 10, 7, 7, 10, -4, -3, 1, -6, -8,
]);

console.log(answer);
