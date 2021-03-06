// Cost: 24.90GB
// root.js but it solves coding contracts it can as well

const solution_functions = {
    /**
     * Return all possible ways you can add the +, -, and * operators to the string
     * such that it evaluates to the target number.
     * @param {[string, number]}
     * @returns {string[]}
     */
    "Find All Valid Math Expressions": ([digits, target]) => {
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
    },
    "Minimum Path Sum in a Triangle": arr2d => {
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
    },
    /** @param {number[][]} arr2d */
    "Spiralize Matrix": arr2d => {
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
    },
    /** @param {number[]} arr */
    "Subarray with Maximum Sum": arr => {
        let maxN = 0;
        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length + 1; j++) {
                const nArr = arr.slice(i, j);
                const nMax = nArr.reduce((a, b) => a + b);
                if (nMax > maxN) maxN = nMax;
            }
        }
        return maxN;
    },
    /** @param {number} n */
    "Find Largest Prime Factor": n => {
        let x = n;
        let i = 2;

        while (x !== 1) {
            if (x % i === 0) x /= i;
            else i++;
        }

        return i;
    },
    "Array Jumping Game": data => {
        /** @param {number[]} arr */
        function arrayJumpingGame(arr, index = 0) {
            if (index === arr.length - 1) return 1;

            for (let i = index + 1; i <= index + arr[index]; i++) {
                if (arrayJumpingGame(arr, i) === 1) return 1;
            }

            return 0;
        }
        return arrayJumpingGame(data);
    },
    /** @param {number} data */
    "Total Ways to Sum": data => {
        let count = 0;

        function partition(n, max) {
            if (n == 0) {
                count++;
                return;
            }
            for (let i = Math.min(max, n); i >= 1; i--) {
                partition(n - i, i);
            }
        }

        partition(data, data - 1);
        return count;
    },
};

let already_tried, can_hack, can_attack;
let use_bought_servers = false;

function isNotBoughtServer(s) {
    if (use_bought_servers) return true;
    return !((s.length === 2 || s.length === 3) && s[0] === "s") && s.slice(0, 7) !== "hacknet";
}

/**
 * @param {import(".").NS} ns
 * @param {string} parent
 */
function root(ns, parent) {
    already_tried.push(parent);
    const servers = ns.scan(parent);

    for (const server of servers) {
        if (!already_tried.includes(server) && isNotBoughtServer(server)) {
            let portsOpen = 0;
            if (ns.fileExists("brutessh.exe", "home")) {
                ns.brutessh(server);
                portsOpen++;
            }
            if (ns.fileExists("ftpcrack.exe", "home")) {
                ns.ftpcrack(server);
                portsOpen++;
            }
            if (ns.fileExists("relaysmtp.exe", "home")) {
                ns.relaysmtp(server);
                portsOpen++;
            }
            if (ns.fileExists("httpworm.exe", "home")) {
                ns.httpworm(server);
                portsOpen++;
            }
            if (ns.fileExists("sqlinject.exe", "home")) {
                ns.sqlinject(server);
                portsOpen++;
            }
            if (portsOpen >= ns.getServerNumPortsRequired(server)) {
                ns.nuke(server);
                if (ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
                    if (ns.getServerMaxRam(server) > 0) can_attack.push(server);
                    if (ns.getServerMaxMoney(server) > 0) can_hack.push(server);
                }
            }

            for (const file of ns.ls(server, "cct")) {
                ns.tprint("coding contract found on ", server);
                const type = ns.codingcontract.getContractType(file, server);
                const input = ns.codingcontract.getData(file, server);
                const func = solution_functions[type];

                if (func) {
                    const answer = func(input);
                    const reward = ns.codingcontract.attempt(answer, file, server, {
                        returnReward: true,
                    });
                    if (reward) {
                        ns.tprint("INFO ", reward, "\n\n");
                    } else {
                        ns.tprint("ERROR contract `", type, "` failed\n\n");
                    }
                } else {
                    ns.tprint("WARN no solution function exists for ", type, "\n\n");
                }
            }

            root(ns, server);
        }
    }
}

/** @param {import(".").NS} ns */
export async function main(ns) {
    const {
        hack,
        share: doShare,
        bought,
    } = ns.flags([["hack"], ["share", false], ["bought", false]]);

    use_bought_servers = bought;

    already_tried = ["home", "darkweb"];
    can_hack = [];
    can_attack = [];
    root(ns, "home");
    ns.tprint("hackable servers: ", can_hack, "\n\n");
    ns.tprint("hostable servers: ", can_attack);

    if (hack) {
        ns.tprint(`WARN using hack3.js to hack ${hack} with ${can_attack}`);
        ns.spawn("/scripts/hack3.js", 1, hack, ...can_attack);
    } else if (doShare) {
        ns.tprint(`WARN using share-many.js with ${can_attack}`);
        ns.spawn("/scripts/share-many.js", 1, ...can_attack);
    }
}
