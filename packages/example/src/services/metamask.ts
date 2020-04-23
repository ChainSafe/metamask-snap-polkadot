import {PolkadotApi} from "@nodefactory/metamask-polkadot-types";
import {web3Enable} from "@polkadot/extension-dapp";
import {InjectedMetamaskExtension} from "@nodefactory/metamask-polkadot-adapter/src/types";

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

export async function getInjectedMetamaskExtension(): Promise<InjectedMetamaskExtension | null> {
    const allInjected = await web3Enable('my cool dapp');
    const provider = allInjected.find(item => item.name === "metamask-polkadot-snap") as unknown as InjectedMetamaskExtension;
    if(provider) return provider;
    else return null;
}