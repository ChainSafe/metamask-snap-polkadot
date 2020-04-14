import { injectExtension } from '@polkadot/extension-inject';
import {MetamaskPolkadotSnap, NetworkConfig} from "./snap";
import {isPolkadotSnapInstalled, installPolkadotSnap} from "./methods";

export function injectMetamaskPolkadotSnapProvider(
    network: "kusama"|"polkadot", 
    config?: {
        network?: NetworkConfig
        pluginOrigin?: string
    },
    ): void {
    const polkadotSnap = new MetamaskPolkadotSnap(network, config.network);
    if(isPolkadotSnapInstalled && installPolkadotSnap) {
    injectExtension(() => polkadotSnap.enableSnap(config.pluginOrigin), { name: 'metmask-polkadot-snap', version: '1.0.0' });
    }   
}