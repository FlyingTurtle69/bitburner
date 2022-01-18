/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.tprint("Karma: ", Math.round(ns.heart.break()));
    ns.tprint("Kills: ", ns.getPlayer().numPeopleKilled);
}
