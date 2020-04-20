import {SnapConfig} from "@nodefactory/metamask-polkadot-types";
import {BlockInfo} from "@nodefactory/metamask-polkadot-types";
import {MetamaskPolkadotRpcRequest} from "@nodefactory/metamask-polkadot-types";

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
    return false;
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

export async function addPolkadotAsset(pluginOrigin: string): Promise<void> {
  await window.ethereum.send({
    method: pluginOrigin,
    params: [{
      method: 'addPolkadotAsset'
    }]
  });
}

async function sendSnapMethod(request: MetamaskPolkadotRpcRequest,
  pluginOrigin: string): Promise<unknown> {
  const response = await window.ethereum.send({
    method: pluginOrigin,
    params: [
      request
    ]
  });
  return response;
}

export async function getBalance(pluginOrigin: string): Promise<string> {
  const response = await sendSnapMethod({method: "getBalance"}, pluginOrigin);
  return response as string;
}

export async function getAddress(pluginOrigin: string): Promise<string> {
  const response = await sendSnapMethod({method: "getAddress"}, pluginOrigin);
  return response as string;
}

export async function getPublicKey(pluginOrigin: string): Promise<string> {
  const response = await sendSnapMethod({method: "getPublicKey"}, pluginOrigin);
  return response as string;
}

export async function exportSeed(pluginOrigin: string): Promise<string> {
  const response = await sendSnapMethod({method: "exportSeed"}, pluginOrigin);
  return response as string;
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
    return {hash: "", number: ""};
  }
}

export async function setConfiguration(pluginOrigin: string, configuration: SnapConfig): Promise<void> {
  await window.ethereum.send({
    method: pluginOrigin,
    params: [{
      method: 'configure',
      params: {configuration: configuration}
    }]
  });
}

export async function getAllTransactions(pluginOrigin: string, address?: string): Promise<unknown> {
  return await window.ethereum.send({
    method: pluginOrigin,
    params: [{
      method: 'getAllTransactions',
      params: {
        address
      }
    }]
  });
}