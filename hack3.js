// Hack a target simultaneously from multiple servers without needing Formulas.exe

/** @param {import(".").NS } ns */
export async function main(ns) {
    const target = ns.args[0];
    const moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    const securityThresh = ns.getServerMinSecurityLevel(target) + 5;
    const servers = ns.args.slice(1);
    const files = ["/scripts/weak.js", "/scripts/grow.js", "/scripts/hack.js"];
    const threads = {}; // threads for each server

    for (const server of servers) {
        ns.killall(server);
        await ns.scp(files, "home", server);
        const ram = ns.getServerMaxRam(server);
        threads[server] = Math.floor(ram / 1.75);
    }

    while (true) {
        let script;
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            script = "/scripts/weak.js";
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            script = "/scripts/grow.js";
        } else {
            script = "/scripts/hack.js";
        }
        for (const server of servers) {
            ns.exec(script, server, threads[server], target);
        }
        /* There's no need for other checks because it will just keep failing 
        until it's finished (not crashing) since it's using max ram.
        The sleep is just necessary to prevent freezing*/
        await ns.sleep(2000);
    }
}
