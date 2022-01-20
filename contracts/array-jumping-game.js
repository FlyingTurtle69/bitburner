// Array Jumping Game

/** @param {number[]} arr */
function arrayJumpingGame(arr, index = 0) {
    if (index === arr.length - 1) return 1;

    for (let i = index + 1; i <= index + arr[index]; i++) {
        if (arrayJumpingGame(arr, i) === 1) return 1;
    }

    return 0;
}
