/** @param {import(".").NS } ns */
export async function main(ns) {
    const server = ns.args[0];
    const ram = ns.args[1];

    if (ns.getServerMaxRam(server) >= ram) {
        ns.tprint("ERROR new RAM amount less than or equal to current");
        return;
    }

    const delete_success = ns.deleteServer(server);

    if (delete_success) {
        const purchase_success = ns.purchaseServer(server, ram);
        if (purchase_success) {
            ns.tprint(`INFO successfully rebought ${server} with ${ram}GB of RAM`);
        } else {
            ns.tprint("WARNING deletion occurred but purchase was unsuccessful");
        }
    } else {
        ns.tprint("ERROR delete unsuccessful. The server doesn't exist or has scripts running");
    }
}
