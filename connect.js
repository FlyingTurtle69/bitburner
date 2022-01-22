// Modified from https://github.com/bitburner-official/bitburner-scripts/blob/master/find_server.js

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
    let route = [];
    let server = args._[0];
    if (!server || args.help) {
        ns.tprint("This script connects to any server");
        ns.tprint(`Usage: run ${ns.getScriptName()} SERVER`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} n00dles`);
        return;
    }

    recursiveScan(ns, "", "home", server, route);

    for (const s of route) {
        ns.connect(s);
    }
}

export function autocomplete(data, args) {
    return data.servers;
}
