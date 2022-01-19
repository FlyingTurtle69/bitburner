/**
 * Return all possible ways you can add the +, -, and * operators to the string
 * such that it evaluates to the target number.
 * @param {[string, number]}
 * @returns {string[]}
 */
function validMathExpressions([digits, target]) {
    /**
     * @param {string} expression
     * @param {number} index
     * @returns {array}
     */
    function allExpressions(expression, index = 0) {
        if (index === digits.length) return expression;

        const exprs = [];
        for (let i = index + 1; i <= digits.length; i++) {
            const segment = digits.slice(index, i);

            // filter out leading 0s
            if (segment.length > 1 && segment[0] == "0") continue;

            if (index === 0) {
                exprs.push(allExpressions(segment, i));
            } else {
                exprs.push(allExpressions(expression + "+" + segment, i));
                exprs.push(allExpressions(expression + "-" + segment, i));
                exprs.push(allExpressions(expression + "*" + segment, i));
            }
        }
        return exprs;
    }
    return allExpressions("")
        .flat(Infinity)
        .filter(e => eval(e) === target);
}

const test1 = validMathExpressions(["123", 6]);
console.log(test1); // [1+2+3, 1*2*3]

const test2 = validMathExpressions(["105", 5]);
console.log(test2); // [1*0+5, 10-5]
