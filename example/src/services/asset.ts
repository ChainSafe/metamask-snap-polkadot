import {pluginOrigin} from "./metamask";

export async function addDotAsset(): Promise<boolean> {
    try {
        await window.ethereum.send({
            method: pluginOrigin,
            params: [{
                method: 'addDotAsset'
            }]
        });
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}