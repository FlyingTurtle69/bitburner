// Cost: 11.60GB (with SF4.3)
// Requires: BN4

/**
 * @param {import(".").NS} ns
 * @param {CrimeType} crime
 * @param {CrimeType?} new_crime
 * @param {number?} threshold
 */
async function doCrime(ns, crime, new_crime, threshold) {
    const time = ns.singularity.commitCrime(crime);
    while (!new_crime || ns.singularity.getCrimeChance(new_crime) < threshold) {
        await ns.sleep(time);
        ns.print("INFO karma: ", ns.heart.break());
    }
}

/** @param {import(".").NS} ns */
export async function main(ns) {
    ns.tail();
    await doCrime(ns, "Shoplift", "Mug", 0.6);
    await doCrime(ns, "Mug", "Homicide", 0.8);
    await doCrime(ns, "Homicide");
}
