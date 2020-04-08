import { injectExtension } from '@polkadot/extension-inject';
import {Injected, InjectedAccounts} from "@polkadot/extension-inject/types";
import { Signer as InjectedSigner } from '@polkadot/api/types';
import {installPolkadotSnap, isPolkadotSnapInstalled} from "../example/src/services/metamask";
import {pluginOrigin} from "../example/src/services/metamask";

interface NetworkConfig {
    explorerUrl: string;
    rpcUrl: string;
    unitName: string;
}

class MetamaskPolkadotSnap implements Injected {
    //TODO
    public accounts: InjectedAccounts = {
        get: ()=>{},
        subscribe: ()=>{}
    }
    public signer: InjectedSigner;
    
    //TODO
    constructor(network: string, config: NetworkConfig) {

    };


    public enableSnap = async (origin: string): Promise<Injected> => {
        if(isPolkadotSnapInstalled) {
            await window.ethereum.send({
                method: "wallet_enable",
                params: [{
                    [pluginOrigin]: {}
                }]
            });
            //TODO
            await addAsset();
        }
        return this;
    }
}

export function injectMetamaskPolkadotSnapProvider(network: "kusama"|"polkadot", config: NetworkConfig): void {
    const PolkadotSnap = new MetamaskPolkadotSnap(network, config);
    if(isPolkadotSnapInstalled && installPolkadotSnap) {
    injectExtension(PolkadotSnap.enableSnap(network), { name: 'metmask-polkadot-snap', version: '1.0.0' });
    }   
 }
