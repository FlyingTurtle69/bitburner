// Cost: 12.10GB (with SF4.3)
// Requires: BN4

/**
 * @param {import(".").NS} ns
 * @param {string} crime
 */
async function doCrime(ns, crime) {
    const time = ns.commitCrime(crime);
    while (ns.isBusy()) {
        await ns.sleep(time);
    }
}

/** @param {import(".").NS} ns */
export async function main(ns) {
    ns.tail();

    while (ns.getCrimeChance("Mug someone") < 0.6) await doCrime(ns, "Shoplift");

    while (ns.getCrimeChance("Homicide") < 0.8) await doCrime(ns, "Mug someone");

    while (true) {
        await doCrime(ns, "Homicide");
        ns.print("INFO karma: ", ns.heart.break());
    }
}
