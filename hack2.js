// Hack a list of target, on each server is a list using all available RAM

/** @param {import(".").NS } ns */
export async function main(ns) {
    const targets = eval(ns.args[0]);
    const servers = eval(ns.args[1]);
    const files = ["/scripts/weak.js", "/scripts/grow.js", "/scripts/hack.js", "/scripts/hack1.js"];

    for (const server of servers) {
        ns.killall(server);
        await ns.scp(files, server, "home");
        const ram_each = ns.getServerMaxRam(server) / targets.length;
        for (const target of targets) {
            ns.exec("/scripts/hack1.js", server, 1, target, ram_each);
            await ns.sleep(1000); // delay to make it out of sync
        }
        await ns.sleep(90000); // more delay to make it out of sync
    }
}
