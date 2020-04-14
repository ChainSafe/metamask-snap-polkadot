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