import ApiPromise from "@polkadot/api/promise";
import {WsProvider} from "@polkadot/api";
import {Wallet} from "../interfaces";
import {getConfiguration} from "../configuration";

let api: ApiPromise;
let provider: WsProvider;
let isConnecting: boolean;

/**
 * Initialize substrate api and awaits for it to be ready
 */
async function initApi(wsRpcUrl: string): Promise<ApiPromise> {
  provider = new WsProvider(wsRpcUrl);
  console.log("PROVIDER CREATED");
  let api = await ApiPromise.create({
    initWasm: false,
    provider,
    // this seems not to make any difference anymore
    types: {
      RuntimeDbWeight: {
        read: 'Weight',
        write: 'Weight'
      }
    }
  });

  console.log("API READY");
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

export const getApi = async (wallet: Wallet): Promise<ApiPromise> => {
  if (!api) {
    // api not initialized or configuration changed
    const config = getConfiguration(wallet);
    api = await initApi(config.wsRpcUrl);
    isConnecting = false;
  } else {
    while (isConnecting) {
      await new Promise(r => setTimeout(r, 100));
    }
    if (!provider.isConnected()) {
      isConnecting = true;
      await provider.connect();
      isConnecting = false;
    }
  }
  return api;
};
