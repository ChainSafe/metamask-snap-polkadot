import {pluginOrigin} from "./metamask";


export async function setConfiguration(): Promise<void> {
    return await window.ethereum.send({
        method: pluginOrigin,
        params: [{
            method: 'configure',
            params: {configuration: {network: "kusama"}}
        }]
    });
}