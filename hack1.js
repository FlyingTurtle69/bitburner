/** @param {import(".").NS } ns */
export async function main(ns) {
    const threads = ns.args[1];
    const target = ns.args[0];
    const moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    const securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    const player = ns.getPlayer();
    const server = ns.getServer(target);

    while (true) {
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
        await ns.sleep(waitTime + 200);
    }
}
