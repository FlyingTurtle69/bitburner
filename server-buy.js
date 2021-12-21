// Cost: 6.35GB

/** @param {import(".").NS } ns */
export async function main(ns) {
    const servers = ns.getPurchasedServers();
    const last = Number(servers[servers.length - 1][1]);
    const name = ns.purchaseServer(`s${last + 1}`, ns.args[0]);
    if (name === "") {
        ns.tprint("Failed to purchase");
        ns.tprint(
            `It costs $${ns.getPurchasedServerCost(ns.args[0])} for a ${ns.args[0]}GB server`
        );
    } else ns.tprint("Successfully bought server ", name);
}
