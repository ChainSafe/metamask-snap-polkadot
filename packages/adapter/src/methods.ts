import {SnapConfig} from "@nodefactory/metamask-polkadot-types";
import {BlockInfo} from "../../../packages/snap/src/rpc/substrate/getBlock";

export async function getAccountAddress(pluginOrigin: string): Promise<string> {
  return await window.ethereum.send({
    method: pluginOrigin,
    params: [{
      method: 'getAddress'
    }]
  }) as string;
}

export function hasMetaMask(): boolean {
  if (!window.ethereum) {
      return false
  }
  return window.ethereum.isMetaMask;

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

export async function addKusamaAsset(pluginOrigin: string): Promise<void> {
  await window.ethereum.send({
      method: pluginOrigin,
      params: [{
          method: 'addKusamaAsset'
      }]
  });
}

export async function addPolkadotAsset(pluginOrigin: string): Promise<void> {
  await window.ethereum.send({
      method: pluginOrigin,
      params: [{
          method: 'addPolkadotAsset'
      }]
  });
}

async function sendSnapMethod(method: 'getBalance' | 'getAddress' | 'getPublicKey' | 'exportSeed', pluginOrigin: string): Promise<string|null> {
  try {
      await window.ethereum.send({
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

export async function getBalance(pluginOrigin: string): Promise<string> {
  const response = await sendSnapMethod("getBalance", pluginOrigin);
  return (response != null) ? response : "Unable to fetch balance";
}

export async function getAddress(pluginOrigin: string): Promise<string> {
  const response = await sendSnapMethod("getAddress", pluginOrigin);
  return (response != null) ? response : "Unable to fetch address";
}

export async function getPublicKey(pluginOrigin: string): Promise<string> {
  const response = await sendSnapMethod("getPublicKey", pluginOrigin);
  return (response != null) ? response : "Unable to fetch public key";
}

export async function exportSeed(pluginOrigin: string): Promise<string> {
  const response = await sendSnapMethod("exportSeed", pluginOrigin);
  return (response != null) ? response : "Unable to fetch seed";
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

export async function getLatestBlock(pluginOrigin: string): Promise<BlockInfo> {
  try {
      const blockResponse = await window.ethereum.send({
          method: pluginOrigin,
          params: [{
              method: "getBlock",
              params: {
                  blockTag: "latest"
              }
          }]
      });
      return blockResponse as BlockInfo;
  } catch (e) {
      console.log("Unable to fetch latest block", e);
      return {number: "", hash: ""};
  }
}

export async function setConfiguration(configuration: SnapConfig, pluginOrigin: string): Promise<void> {
  await window.ethereum.send({
      method: pluginOrigin,
      params: [{
          method: 'configure',
          params: {configuration: configuration}
      }]
  });
}

export async function getAllTransactions(pluginOrigin: string, address?: string): Promise<any> {
  try {
    return await window.ethereum.send({
      method: pluginOrigin,
      params: [{
        method: 'getAllTransactions',
          params: {
            address
          }
      }]
    });
  } catch (e) {
    console.log("Unable to fetch transactions", e);
  }
}