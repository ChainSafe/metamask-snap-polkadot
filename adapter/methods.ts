export const origin = new URL('package.json', 'http://localhost:8081').toString();
export const pluginOrigin = `wallet_plugin_${origin}`;

export async function getAccountAddress(): Promise<string> {
    const result: any = await window.ethereum.send({
        method: 'getAddress',
    });
    return result;
}

export async function installPolkadotSnap(): Promise<boolean> {
    try {
        await window.ethereum.send({
            method: 'wallet_enable',
            params: [{
                [pluginOrigin]: {}
            }]
        });
        console.log("Snap installed!!");
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function isPolkadotSnapInstalled(): Promise<boolean> {
    try {
        const result: any = await window.ethereum.send({
            method: 'wallet_getPlugins',
        });
        return !!result[origin];
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function addKusamaAsset(): Promise<void> {
    return await window.ethereum.send({
        method: pluginOrigin,
        params: [{
            method: 'addKusamaAsset'
        }]
    });
}

export async function addPolkadotAsset(): Promise<void> {
    return await window.ethereum.send({
        method: pluginOrigin,
        params: [{
            method: 'addPolkadotAsset'
        }]
    });
}

async function sendSnapMethod(method: 'getBalance' | 'getAddress' | 'getPublicKey' | 'exportSeed'): Promise<string|null> {
    try {
        return await window.ethereum.send({
            method: pluginOrigin,
            params: [{
                method: method
            }]
        });
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