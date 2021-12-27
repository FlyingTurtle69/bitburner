// Costs: 2.30GB

const already_tried = ["home", "darkweb"];

/**
 * @param {import(".").NS} ns
 * @param {string} parent
 */
function root(ns, parent) {
    already_tried.push(parent);
    const servers = ns.scan(parent);

    for (const server of servers) {
        if (!already_tried.includes(server)) {
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
            }
            root(ns, server);
        }
    }
}

/** @param {import(".").NS} ns */
export async function main(ns) {
    root(ns, "home");
}
