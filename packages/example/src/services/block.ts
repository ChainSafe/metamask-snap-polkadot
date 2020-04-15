import {pluginOrigin} from "./metamask";
import {BlockInfo} from "polkadot-snap/src/rpc/substrate/getBlock";

export async function getLatestBlock(): Promise<BlockInfo> {
    try {
        return await window.ethereum.send({
            method: pluginOrigin,
            params: [{
                method: "getBlock",
                params: {
                    blockTag: "latest"
                }
            }]
        });
    } catch (e) {
        console.log("Unable to fetch latest block", e);
        return {number: "", hash: ""};
    }
}