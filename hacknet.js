// Cost: 10.10GB
// Requires Formulas.exe

/** @param {import(".").NS } ns */
export async function main(ns) {
    const NEW_NODE = -1;
    const NEW_LEVELS = 10;

    while (true) {
        const nodes_num = ns.hacknet.numNodes();
        const { money } = ns.getPlayer();
        const { production } = ns.getHacknetMultipliers();
        const money_thresh = money * 0.75;
        let best_ratio = 0;
        let best_node = NEW_NODE;
        let best_upgrade = "";

        for (let i = 0; i < nodes_num; i++) {
            const { cores, ram, level } = ns.hacknet.getNodeStats(i);
            const gain = (l = 0, r = 0, c = 0) =>
                ns.formulas.hacknetNodes.moneyGainRate(level + l, ram + r, cores + c, production);

            const level_cost = ns.hacknet.getLevelUpgradeCost(i, NEW_LEVELS);
            const level_ratio = gain(NEW_LEVELS) / level_cost;
            if (level < 200 && level_cost < money_thresh && level_ratio > best_ratio) {
                best_ratio = level_ratio;
                best_node = i;
                best_upgrade = "level";
                ns.print("ratio: ", best_ratio, " node: ", best_node, best_upgrade);
            }

            const ram_cost = ns.hacknet.getRamUpgradeCost(i, 1);
            const ram_ratio = gain(0, ram) / ram_cost;
            if (ram < 64 && ram_cost < money_thresh && ram_ratio > best_ratio) {
                best_ratio = ram_ratio;
                best_node = i;
                best_upgrade = "ram";
                ns.print("ratio: ", best_ratio, " node: ", best_node, best_upgrade);
            }

            const core_cost = ns.hacknet.getCoreUpgradeCost(i, 1);
            const core_ratio = gain(0, 0, 1) / core_cost;
            if (cores < 16 && core_cost < money_thresh && core_ratio > best_ratio) {
                best_ratio = core_ratio;
                best_node = i;
                best_upgrade = "core";
                ns.print("ratio: ", best_ratio, " node: ", best_node, best_upgrade);
            }
        }

        if (best_node === NEW_NODE) {
            if (ns.hacknet.getPurchaseNodeCost() < money_thresh) {
                ns.hacknet.purchaseNode();
                ns.print("INFO bought server");
            }
        } else {
            if (best_upgrade === "level") {
                if (ns.hacknet.upgradeLevel(best_node, NEW_LEVELS)) {
                    ns.print("INFO upgraded level on node ", best_node);
                } else {
                    ns.print("WARN failed to upgrade node level");
                }
            } else if (best_upgrade === "ram") {
                if (ns.hacknet.upgradeRam(best_node, 1)) {
                    ns.print("INFO upgraded ram on node ", best_node);
                } else {
                    ns.print("WARN failed to upgrade node ram");
                }
            } else {
                if (ns.hacknet.upgradeCore(best_node, 1)) {
                    ns.print("INFO upgraded cores on node ", best_node);
                } else {
                    ns.print("WARN failed to upgrade node cores");
                }
            }
        }

        await ns.sleep(nodes_num * Math.random() * 1000 * 10);
    }
}
