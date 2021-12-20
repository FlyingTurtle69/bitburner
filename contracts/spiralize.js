// contract-514633 on silver-helix

/**
 * @param {number[][]} arr2d
 */
function spiralize(arr2d) {
    const middleRow = arr2d[1];
    const middleRight = middleRow.pop();
    const bottomRow = arr2d[2];
    bottomRow.reverse();
    return [...arr2d[0], middleRight, ...bottomRow, ...middleRow];
}

const answer = spiralize([
    [29, 27, 25, 17, 4, 48, 45, 32, 15, 29, 45, 17, 22],
    [44, 46, 16, 49, 40, 12, 17, 44, 2, 23, 25, 46, 28],
    [46, 17, 15, 41, 10, 20, 36, 42, 40, 45, 34, 42, 17],
]);
console.log(answer);
