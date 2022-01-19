// Spiralize Matrix

/** @param {number[][]} arr2d */
function spiralize(arr2d) {
    const height = arr2d.length;
    const width = arr2d[0].length;

    let left_bound = 0;
    let right_bound = width - 1;
    let up_bound = 0;
    let down_bound = height - 1;

    let remaining = height * width;
    let y = 0;
    let x = 0;
    let direction = "RIGHT";
    const answer = [];

    while (remaining > 0) {
        answer.push(arr2d[y][x]);

        if (x === right_bound && direction === "RIGHT") {
            direction = "DOWN";
            up_bound++;
        } else if (y === down_bound && direction === "DOWN") {
            direction = "LEFT";
            right_bound--;
        } else if (x === left_bound && direction === "LEFT") {
            direction = "UP";
            down_bound--;
        } else if (y === up_bound && direction === "UP") {
            direction = "RIGHT";
            left_bound++;
        }

        if (direction === "RIGHT") x++;
        else if (direction === "LEFT") x--;
        else if (direction === "UP") y--;
        else y++; // DOWN

        remaining--;
    }

    return answer;
}

const test1 = spiralize([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]);
console.log(test1); // [1, 2, 3, 6, 9, 8 ,7, 4, 5]

const test2 = spiralize([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
]);
console.log(test2); // [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
