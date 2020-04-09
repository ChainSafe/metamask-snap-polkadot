import { injectExtension } from '@polkadot/extension-inject';
import {Injected, InjectedAccounts, InjectedAccount} from "@polkadot/extension-inject/types";
import { Signer as InjectedSigner } from '@polkadot/api/types';

interface NetworkConfig {
    explorerUrl: string;
    rpcUrl: string;
    unitName: string;
}

class MetamaskPolkadotSnap implements Injected {

    public accounts: InjectedAccounts = {
        get: async () => {
            const account: InjectedAccount = {
               address: await getAccountAddress(),
               genesisHash: null,
               name: "Metamask account"
            }
            return [account];
            },
        subscribe: () => {
            const unsubCall = () => {};
            return unsubCall;
            }
    }
    public signer: InjectedSigner;
    
    //TODO
    constructor(network: string, config: NetworkConfig) {

    };


    public enableSnap = async (origin?: string): Promise<Injected> => {
        const defaultOrigin = new URL('package.json', 'http://localhost:8081').toString();
        const defaultPluginOrigin = `wallet_plugin_${defaultOrigin}`;

        if(isPolkadotSnapInstalled) {
            await window.ethereum.send({
                method: "wallet_enable",
                params: [{
                    [origin ? origin : defaultPluginOrigin]: {}
                }]
            });
            addKusamaAsset();
        }
        return this;
    }
}

export function injectMetamaskPolkadotSnapProvider(
    network: "kusama"|"polkadot", 
    config: NetworkConfig,
    pluginOrigin?: string
    ): void {
    const PolkadotSnap = new MetamaskPolkadotSnap(network, config);
    if(isPolkadotSnapInstalled && installPolkadotSnap) {
    injectExtension(() => PolkadotSnap.enableSnap(pluginOrigin), { name: 'metmask-polkadot-snap', version: '1.0.0' });
    }   
 }

declare global {
    interface Window {
        ethereum: {
            isMetaMask: boolean;
            send: (params: any)=> Promise<any>;
            on: (eventName: any, callback: any) => any;
        }
    }
}
export const origin = new URL('package.json', 'http://localhost:8081').toString();
export const pluginOrigin = `wallet_plugin_${origin}`;

export async function getAccountAddress(): Promise<string> {
    try {
        const result: any = await window.ethereum.send({
            method: 'getAddress',
        });
        return result;
    } catch (e) {
        console.log(e);
        return "";
    }
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