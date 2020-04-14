
import {origin} from "./metamask";
import {PolkadotApi} from "../interfaces";


let api: PolkadotApi;

export async function getPolkadotApi(): Promise<PolkadotApi|undefined> {
    if (api) {
        return api
    } else {
        try {
            let index = await window.ethereum.requestIndex();
            api = await index.getPluginApi(origin);
            return api;
        } catch (e) {
            console.log(e);
        }
    }
}