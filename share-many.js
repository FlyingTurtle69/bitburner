/** @param {import(".").NS} ns */
export async function main(ns) {
    const servers = ns.args;

    const SHARE_SCRIPT = "/scripts/share.js";
    const SHARE_RAM = 4;

    for (const server of servers) {
        ns.killall(server);
        const ram = ns.getServerMaxRam(server);
        const threads = Math.floor(ram / SHARE_RAM);

        await ns.scp(SHARE_SCRIPT, server);
        ns.exec(SHARE_SCRIPT, server, threads);
    }
}
