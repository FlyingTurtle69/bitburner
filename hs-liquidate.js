// Cost: 5.60GB
// Requires: BN9
// Turn all available hashes into money

/** @param {import(".").NS } ns */
export async function main(ns) {
    let counter = 0;
    while (ns.hacknet.spendHashes("Sell for Money")) {
        counter++;
    }
    ns.tprint(`INFO Liquidated $${counter}m`);
}
