// Hacking Gang Manager

/** @param {import(".").NS } ns */
export async function main(ns) {
    const EQUIPMENT = ns.gang.getEquipmentNames().filter(e => ns.gang.getEquipmentStats(e).hack);

    while (true) {
        const members = ns.gang.getMemberNames();

        const new_member = "Joe " + members.length.toString();
        if (ns.gang.recruitMember(new_member)) {
            // TODO: Make sure this is right
            ns.gang.setMemberTask(new_member, "Train Hacking");
            members.push(new_member); // for the equipment
        }

        // Ascending
        for (const member of members) {
            // TODO: Do the 1.6 -> 1.1 thing
            if (ns.gang.getAscensionResult(member)?.hack > 1.6) {
                ns.gang.ascendMember(member);
                ns.gang.setMemberTask(member, "Train Hacking");
                // Only ascend one member per cycle
                break;
            }
        }

        for (const member of members) {
            // Buy Equipment
            let equip_counter = 0;
            for (const equip of EQUIPMENT) {
                if (ns.gang.purchaseEquipment(member, equip)) equip_counter++;
            }
            if (equip_counter > 0) ns.print(`bought ${equip_counter} for ${member}`);

            // TODO: Set Task
        }

        await ns.sleep(10000);
    }
}
