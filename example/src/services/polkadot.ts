import {origin} from "./metamask";
import {PolkadotApi} from "../interfaces";

export async function getPolkadotApi(): Promise<PolkadotApi|undefined> {
    try {
        let index = await window.ethereum.requestIndex();
        const api = await index.getPluginApi(origin);
        console.log("FETCHING NEW API");
        return api;
    } catch (e) {
        console.log(e);
    }
}