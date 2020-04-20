import {PolkadotApi} from "@nodefactory/metamask-polkadot-types";

declare global {
    interface Window {
        ethereum: {
            isMetaMask: boolean;
            send: (params: any)=> Promise<any>;
            on: (eventName: any, callback: any) => any;
            requestIndex: () => Promise<{getPluginApi: (origin: string) => Promise<PolkadotApi>}>;
        }
    }
}

export function hasMetaMask(): boolean {
    if (!window.ethereum) {
        return false
    }
    return window.ethereum.isMetaMask;

}

export const origin = new URL('package.json', 'http://localhost:8081').toString();
export const pluginOrigin = `wallet_plugin_${origin}`;

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