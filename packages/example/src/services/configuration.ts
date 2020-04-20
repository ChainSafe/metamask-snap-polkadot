import {pluginOrigin} from "./metamask";
import {SnapConfig} from "@nodefactory/metamask-polkadot-types";


export async function setConfiguration(configuration: SnapConfig): Promise<void> {
    return await window.ethereum.send({
        method: pluginOrigin,
        params: [{
            method: 'configure',
            params: {configuration: configuration}
        }]
    });
}