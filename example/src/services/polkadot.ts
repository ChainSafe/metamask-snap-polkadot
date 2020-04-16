import {origin} from "./metamask";
import {PolkadotApi} from "../interfaces";

let api: PolkadotApi;

export async function getPolkadotApi(): Promise<PolkadotApi|undefined> {
    if (!api) {
        console.log("Initializing polkadot API");
        try {
            let index = await window.ethereum.requestIndex();
            api = await index.getPluginApi(origin);
        } catch (e) {
            console.log(e);
        }
    } else {
        console.log("Request for polkadot API");
    }
    return api;
}