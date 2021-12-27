// Buy all the upgrades for all gang members (excluding augmentations)

/** @param {import(".").NS } ns */
export async function main(ns) {
    const members = ns.gang.getMemberNames();
    const equipment = ns.gang
        .getEquipmentNames()
        .filter(x => ns.gang.getEquipmentType(x) !== "Augmentation");

    for (const member of members) {
        let amount_bought = 0;
        for (const e of equipment) {
            const bought = ns.gang.purchaseEquipment(member, e);
            if (bought) amount_bought++;
        }
        if (amount_bought > 0) ns.tprint(`INFO bought ${amount_bought} for ${member}`);
    }
}
