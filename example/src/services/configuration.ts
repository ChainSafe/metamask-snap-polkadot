import {pluginOrigin} from "./metamask";
import {SnapConfig} from "../../../src/configuration/interfaces";


export async function setConfiguration(configuration: SnapConfig): Promise<void> {
    return await window.ethereum.send({
        method: pluginOrigin,
        params: [{
            method: 'configure',
            params: {configuration: configuration}
        }]
    });
}