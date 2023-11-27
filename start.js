// Script to run after installing augments

/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.run("/scripts/root.js", 1, "--hack", "n00dles");
    ns.purchaseTor();
}
