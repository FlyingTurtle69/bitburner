// Cost: 1.95GB

/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.tprint("Max RAM: ", ns.getPurchasedServerMaxRam());
    ns.tprint("Server limit: ", ns.getPurchasedServerLimit());
    ns.tprint("Max RAM cost: ", ns.getPurchasedServerCost(ns.getPurchasedServerMaxRam()));
}
