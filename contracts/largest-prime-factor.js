// Find Largest Prime Factor

// I tried my own method but it was too slow with big numbers
// So I implemented the method from https://www.calculatorsoup.com/calculators/math/prime-factors.php

/** @param {number} n */
function largestPrimeFactor(n) {
    let x = n;
    let i = 2;

    while (x !== 1) {
        if (x % i === 0) x /= i;
        else i++;
    }

    return i;
}

console.log(largestPrimeFactor(132)); // 11
console.log(largestPrimeFactor(1325)); // 53
console.log(largestPrimeFactor(132552)); // 263
console.log(largestPrimeFactor(132552001)); // 4275871
