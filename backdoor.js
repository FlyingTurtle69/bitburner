// Cost: 7.85GB (with SF4.3)
// Requires: BN4

function recursiveScan(ns, parent, server, target, route) {
    const children = ns.scan(server);
    for (let child of children) {
        if (parent == child) {
            continue;
        }
        if (child == target) {
            route.unshift(child);
            route.unshift(server);
            return true;
        }

        if (recursiveScan(ns, server, child, target, route)) {
            route.unshift(server);
            return true;
        }
    }
    return false;
}

/** @param {import(".").NS} ns */
export async function main(ns) {
    const args = ns.flags([["help", false]]);
    const factionBackdoors = ["run4theh111z", "I.I.I.I", "avmnite-02h", "CSEC"];
    let route = [];
    let server = args._[0];

    if (!server) {
        for (const fServer of factionBackdoors) {
            const { backdoorInstalled, requiredHackingSkill } = ns.getServer(fServer);
            if (!backdoorInstalled && ns.getHackingLevel() >= requiredHackingSkill) {
                server = fServer;
                break;
            }
        }
    }

    if (!server || args.help) {
        ns.tprint("This script backdoors any server");
        ns.tprint(`Usage: run ${ns.getScriptName()} SERVER`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} n00dles`);
        return;
    }

    recursiveScan(ns, "", "home", server, route);

    for (const s of route) ns.connect(s);
    await ns.installBackdoor();
    route.reverse();
    for (const s of route) ns.connect(s);
}

export function autocomplete(data, args) {
    return data.servers;
}
