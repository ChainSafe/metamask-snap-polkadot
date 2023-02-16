import {ApiPromise} from "@polkadot/api";
import {WsProvider} from "@polkadot/api";
import {getConfiguration} from "../configuration";
import { SnapsGlobalObject } from "@metamask/snaps-types";

let api: ApiPromise;
let provider: WsProvider;
let isConnecting: boolean;

/**
 * Initialize substrate api and awaits for it to be ready
 */
async function initApi(wsRpcUrl: string): Promise<ApiPromise> {
  provider = new WsProvider(wsRpcUrl);
  const api = await ApiPromise.create({provider});

  console.log("Api is ready");
  return api;
}

export const resetApi = (): void => {
  if (api && provider) {
    try {
      api.disconnect();
    } catch (e) {
      console.log("Error on api disconnect.");
    }
    api = null;
    provider = null;
  }
};

export const getApi = async (snap: SnapsGlobalObject): Promise<ApiPromise> => {
  if (!api) {
    // api not initialized or configuration changed
    const config = await getConfiguration(snap);
    api = await initApi(config.wsRpcUrl);
    isConnecting = false;
  } else {
    while (isConnecting) {
      await new Promise(r => setTimeout(r, 100));
    }
    if (!provider.isConnected) {
      isConnecting = true;
      await provider.connect();
      isConnecting = false;
    }
  }
  return api;
};
