// Costs: 4.25GB

/** @param {import(".").NS } ns */
export async function main(ns) {
    const already_hacked = ns.getHostname() === "home" ? ["home", "darkweb"] : [...ns.args];
    const servers = ns.scan();

    for (const server of servers) {
        if (!already_hacked.includes(server)) {
            already_hacked.push(server);
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
            await ns.scp("/scripts/root.js", "home", server);
            ns.exec("/scripts/root.js", server, 1, ...already_hacked);
        }
    }
}
