import {SnapConfig} from "@nodefactory/metamask-polkadot-types";

export async function getAccountAddress(pluginOrigin: string): Promise<string> {
  return await window.ethereum.send({
    method: pluginOrigin,
    params: [{
      method: 'getAddress'
    }]
  }) as string;
}

export async function installPolkadotSnap(pluginOrigin: string): Promise<boolean> {
  try {
    await window.ethereum.send({
      method: 'wallet_enable',
      params: [{
        [pluginOrigin]: {}
      }]
    });
    return true;
  } catch (e) {
    console.log("Failed to install snap", e);
    return false;
  }
}

export async function isPolkadotSnapInstalled(pluginOrigin: string): Promise<boolean> {
  try {
    const result = await window.ethereum.send({
      method: 'wallet_getPlugins',
    }) as {[k: string]: object};
    return !!result[pluginOrigin];
  } catch (e) {
    console.log("Failed to obtain installed plugins", e);
    return false;
  }
}

export async function addAsset(pluginOrigin: string): Promise<void> {
  await window.ethereum.send({
    method: pluginOrigin,
    params: [{
      method: 'addPolkadotAsset'
    }]
  });
}

export async function configure(pluginOrigin: string, config: SnapConfig): Promise<void> {
  await window.ethereum.send({
    method: pluginOrigin,
    params: [{
      method: 'configure',
      params: {
        configuration: config
      }
    }]
  });
}