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
                    ns.tprint("WARN no solution function exists\n\n");
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
