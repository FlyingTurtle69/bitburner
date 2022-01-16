// Costs: 4.90GB

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
                ns.tprint(server + " nuked");
                if (ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
                    if (ns.getServerMaxRam(server) > 0) can_attack.push(server);
                    if (ns.getServerMaxMoney(server) > 0) can_hack.push(server);
                }
            }
            if (ns.ls(server).some(f => f.slice(-3) === "cct")) {
                ns.tprint("INFO coding contract found on ", server);
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
    ns.tprint("INFO hackable servers: ", can_hack);
    ns.tprint("INFO hostable servers: ", can_attack);

    const { hack } = ns.flags([["hack"]]);
    if (hack) {
        ns.tprint(`WARN using hack3.js to hack ${hack} with ${can_attack}`);
        ns.spawn("/scripts/hack3.js", 1, hack, ...can_attack);
    }
}
