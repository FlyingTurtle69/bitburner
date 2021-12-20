/** @param {import(".").NS } ns */
export async function main(ns) {
    const base_url = "https://raw.githubusercontent.com/FlyingTurtle69/bitburner/main/";
    await ns.wget(base_url + ns.args[0], "/scripts/" + ns.args[0]);
}
