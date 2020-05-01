import {injectExtension} from '@polkadot/extension-inject';
import {MetamaskPolkadotSnap} from "./snap";
import {SnapConfig} from "@nodefactory/metamask-polkadot-types";

const defaultOrigin = new URL('package.json', 'http://localhost:8081').toString();
const defaultPluginOrigin = `wallet_plugin_${defaultOrigin}`;

export function injectMetamaskPolkadotSnapProvider(
  network: "westend"|"kusama",
  config?: SnapConfig,
  pluginOrigin?: string
): void {
  const polkadotSnap = new MetamaskPolkadotSnap(
    pluginOrigin || defaultPluginOrigin,
    config || {networkName: network}
  );
  injectExtension(
    () => polkadotSnap.enableSnap(),
    {name: 'metamask-polkadot-snap', version: '1.0.0'}
  );
}