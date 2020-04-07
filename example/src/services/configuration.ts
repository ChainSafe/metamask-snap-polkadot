import {pluginOrigin} from "./metamask";
import {Configuration} from "../../../src/configuration/configuration";


export async function setConfiguration(configuration: Configuration): Promise<void> {
    return await window.ethereum.send({
        method: pluginOrigin,
        params: [{
            method: 'configure',
            params: {configuration: configuration}
        }]
    });
}