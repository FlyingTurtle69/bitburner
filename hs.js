// Cost: 10.10GB
// Requires: Formulas.exe, BN9
// Hacknet Server Manager

/** @param {import(".").NS } ns */
function liquidate(ns) {
    let counter = 0;
    while (ns.hacknet.spendHashes("Sell for Money")) {
        counter++;
    }
    if (counter) ns.print(`Liquidated $${counter}m`);
}

/** @param {import(".").NS } ns */
function newServerRatio(ns, prod) {
    const gain = ns.formulas.hacknetServers.hashGainRate(1, 0, 1, 1, prod);
    const cost = ns.hacknet.getPurchaseNodeCost();
    return gain / cost;
}

/** @param {import(".").NS } ns */
export async function main(ns) {
    const args = ns.flags([["noUpgrade", false]]);
    ns.disableLog("sleep");

    if (args.noUpgrade) {
        // This causes an error but you can ignore it
        ns.atExit(() => liquidate(ns));

        while (true) {
            if (ns.hacknet.numHashes() > ns.hacknet.hashCapacity() - 4) {
                liquidate(ns);
            }
            await ns.sleep(500);
        }
    }

    const NEW_NODE = -1;
    const CACHE_PENALTY = 5; // to prevent buying cache upgrades as much

    while (true) {
        liquidate(ns);

        const nodes_num = ns.hacknet.numNodes();
        const { money } = ns.getPlayer();
        const { production } = ns.getHacknetMultipliers();

        let best_ratio = newServerRatio(ns, production);
        let best_node = NEW_NODE;
        let best_upgrade = "";

        for (let i = 0; i < nodes_num; i++) {
            const { cores, ram, level, ramUsed } = ns.hacknet.getNodeStats(i);
            const gain = (l = 0, r = 0, c = 0) => {
                return ns.formulas.hacknetServers.hashGainRate(
                    level + l,
                    ramUsed,
                    ram + r,
                    cores + c,
                    production
                );
            };

            const level_cost = ns.hacknet.getLevelUpgradeCost(i, 1);
            const level_ratio = gain(1) / level_cost;
            if (level_cost < money && level_ratio > best_ratio) {
                best_ratio = level_ratio;
                best_node = i;
                best_upgrade = "level";
            }

            const ram_cost = ns.hacknet.getRamUpgradeCost(i, 1);
            const ram_ratio = gain(0, ram) / ram_cost;
            if (ram_cost < money && ram_ratio > best_ratio) {
                best_ratio = ram_ratio;
                best_node = i;
                best_upgrade = "ram";
            }

            const core_cost = ns.hacknet.getCoreUpgradeCost(i, 1);
            const core_ratio = gain(0, 0, 1) / core_cost;
            if (core_cost < money && core_ratio > best_ratio) {
                best_ratio = core_ratio;
                best_node = i;
                best_upgrade = "core";
            }
        }

        if (best_node === NEW_NODE) {
            if (ns.hacknet.getPurchaseNodeCost() < money) {
                ns.hacknet.purchaseNode();
                ns.print("INFO bought server");
            } else {
                let lowest_cache = ns.hacknet.getNodeStats(0).cache;
                let lowest_node = 0;
                for (let i = 1; i < nodes_num; i++) {
                    const { cache } = ns.hacknet.getNodeStats(i);
                    if (cache < lowest_cache) {
                        lowest_cache = cache;
                        lowest_node = i;
                    }
                }
                if (ns.hacknet.getCacheUpgradeCost(lowest_cache, 1) * CACHE_PENALTY < money) {
                    if (ns.hacknet.upgradeCache(lowest_node, 1)) {
                        ns.print("INFO upgraded cache on node ", lowest_node);
                    } else {
                        ns.print("WARN failed to upgrade cache level");
                    }
                }
            }
        } else {
            if (best_upgrade === "level") {
                if (ns.hacknet.upgradeLevel(best_node, 1)) {
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

        await ns.sleep(3000);
    }
}

export function autocomplete() {
    return ["--noUpgrade"];
}
