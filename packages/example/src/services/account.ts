import {pluginOrigin} from "./metamask";

async function sendSnapMethod(method: 'getBalance' | 'getAddress' | 'getPublicKey' | 'exportSeed'): Promise<string|null> {
    try {
        return (await window.ethereum.send({
            method: pluginOrigin,
            params: [{
                method: method
            }]
        })) as string;
    } catch (e) {
        console.log("Keys not generated", e);
    }
    return null;
}

export async function getBalance(): Promise<string> {
    const response = await sendSnapMethod("getBalance");
    return (response != null) ? response : "Unable to fetch balance";
}

export async function getAddress(): Promise<string> {
    const response = await sendSnapMethod("getAddress");
    return (response != null) ? response : "Unable to fetch address";
}

export async function getPublicKey(): Promise<string> {
    const response = await sendSnapMethod("getPublicKey");
    return (response != null) ? response : "Unable to fetch public key";
}

export async function exportSeed(): Promise<string> {
    const response = await sendSnapMethod("exportSeed");
    return (response != null) ? response : "Unable to fetch seed";
}