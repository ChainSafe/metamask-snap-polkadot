import {pluginOrigin} from "./metamask";

export async function addPolkadotAsset(): Promise<void> {
    return await window.ethereum.send({
        method: pluginOrigin,
        params: [{
            method: 'addPolkadotAsset'
        }]
    });
}