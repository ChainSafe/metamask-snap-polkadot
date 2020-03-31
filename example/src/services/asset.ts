import {pluginOrigin} from "./metamask";

export function addDotAsset() {
    return window.ethereum.send({
        method: pluginOrigin,
        params: [{
            method: 'addDotAsset'
        }]
    });
}