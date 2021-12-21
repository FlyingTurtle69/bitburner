// Cost: 5.50GB

/** @param {import(".").NS } ns */
export async function main(ns) {
    const ram = ns.args[1];
    const threads = Math.floor((ram - 5.5) / 1.75);
    const target = ns.args[0];
    const moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    const securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    while (true) {
        const server = ns.getServer(target);
        const player = ns.getPlayer();
        let waitTime;

        if (ns.getServerSecurityLevel(target) > securityThresh) {
            ns.run("/scripts/weak.js", threads, target);
            waitTime = ns.formulas.hacking.weakenTime(server, player);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            ns.run("/scripts/grow.js", threads, target);
            waitTime = ns.formulas.hacking.growTime(server, player);
        } else {
            ns.run("/scripts/hack.js", threads, target);
            waitTime = ns.formulas.hacking.hackTime(server, player);
        }
        await ns.sleep(waitTime + 300);
    }
}
