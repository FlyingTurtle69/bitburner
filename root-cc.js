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
};

let already_tried, can_hack, can_attack;

/**
 * @param {import(".").NS} ns
 * @param {string} parent
 */
function root(ns, parent) {
    already_tried.push(parent);
    const servers = ns.scan(parent);

    for (const server of servers) {
        if (!already_tried.includes(server) && !(server.length === 2 && server[0] === "s")) {
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
    already_tried = ["home", "darkweb"];
    can_hack = [];
    can_attack = [];
    root(ns, "home");
    ns.tprint("hackable servers: ", can_hack, "\n\n");
    ns.tprint("hostable servers: ", can_attack);

    const { hack } = ns.flags([["hack"]]);
    if (hack) {
        ns.tprint(`WARN using hack3.js to hack ${hack} with ${can_attack}`);
        ns.spawn("/scripts/hack3.js", 1, hack, ...can_attack);
    }
}
