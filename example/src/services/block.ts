import {pluginOrigin} from "./metamask";

export async function getLatestBlock(): Promise<string> {
    let blockResponse;
    try {
        blockResponse = await window.ethereum.send({
            method: pluginOrigin,
            params: [{
                method: "getBlock",
                params: {
                    blockTag: "latest"
                }
            }]
        });
        return JSON.stringify(blockResponse.block, null, 2);
    } catch (e) {
        console.log("Unable to fetch latest block", e);
        return "";
    }
}