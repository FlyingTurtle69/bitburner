// Hacking Gang Manager

// note this is not finished

// Ransomware

/**
 * https://www.desmos.com/calculator/yz9swlynt6
 * @param {number} member_count
 */
function maxGainMembers(member_count) {
    return Math.floor(0.731 / (0.0512 + 1.471 ** member_count));
}

/** @param {import(".").NS } ns */
export async function main(ns) {
    const EQUIPMENT = ns.gang.getEquipmentNames().filter(e => ns.gang.getEquipmentStats(e).hack);
    const MAX_MEMBERS = 12;

    while (true) {
        const members = ns.gang.getMemberNames();

        const new_member = "Joe " + members.length.toString();
        if (ns.gang.recruitMember(new_member)) {
            members.push(new_member);
        }

        // Ascending
        for (const member of members) {
            // TODO: Do the 1.6 -> 1.1 thing
            if (ns.gang.getAscensionResult(member)?.hack > 1.3) {
                ns.gang.ascendMember(member);
                // Only ascend one member per cycle
                break;
            }
        }

        /** @type {import(".").GangMemberInfo[]} */
        const gain_members = []; // members that will no train hacking
        const max_gain_mems = maxGainMembers(members.length);

        for (const member of members) {
            ns.gang.setMemberTask(member, "Train Hacking");

            // Buy Equipment
            let equip_counter = 0;
            for (const equip of EQUIPMENT) {
                if (ns.gang.purchaseEquipment(member, equip)) equip_counter++;
            }
            if (equip_counter > 0) ns.print(`INFO bought ${equip_counter} for ${member}`);

            // Find best members for tasks
            if (gain_members.length < max_gain_mems) {
                gain_members.push(ns.gang.getMemberInformation(member));
            } else {
                const new_gain_member = ns.gang.getMemberInformation(member);
                const i = gain_members.findIndex(m => m.hack < new_gain_member.hack);
                if (i !== -1) gain_members[i] = new_gain_member;
            }
        }

        gain_members.sort((a, b) => a.hack - b.hack);
        let task = ""; // TODO: Cyberterrorism but check spelling

        // TODO: Set Task
        for (const member of gain_members) {
            ns.gang.getTaskStats("");
        }

        await ns.sleep(15000);
    }
}
