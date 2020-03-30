import {pluginOrigin} from "./metamask";

export async function getBalance(): Promise<string> {
    let response = null;
    try {
        response = await window.ethereum.send({
            method: pluginOrigin,
            params: [{
                method: 'getBalance'
            }]
        });
    } catch (e) {
        console.log("Keys not generated", e);
    }
    if (response != null) {
        return response
    }
    return "Unable to fetch balance";
}

export async function getAddress(): Promise<string> {
    let response = null;
    try {
        response = await window.ethereum.send({
            method: pluginOrigin,
            params: [{
                method: 'getAddress'
            }]
        });
    } catch (e) {
        console.log("Keys not generated", e);
    }
    if (response != null) {
        return response
    }
    return "Unable to fetch address";
}

export async function getPublicKey(): Promise<string> {
    let response = null;
    try {
        response = await window.ethereum.send({
            method: pluginOrigin,
            params: [{
                method: 'getPublicKey'
            }]
        });
    } catch (e) {
        console.log("Keys not generated", e);
    }
    if (response != null) {
        return response
    }
    return "Unable to fetch public key";
}