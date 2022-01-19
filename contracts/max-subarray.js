// Subarray with Maximum Sum

/** @param {number[]} arr */
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
