import ApiPromise from "@polkadot/api/promise";
import {WsProvider} from "@polkadot/api";
import {Wallet} from "../interfaces";
import {getConfiguration} from "../configuration/configuration";
import {NetworkConfiguration} from "../network/interfaces";

let api: ApiPromise;
let provider: WsProvider;

/**
 * Initialize substrate api and awaits for it to be ready
 */
async function initApi(configuration: NetworkConfiguration): Promise<ApiPromise> {
  provider = new WsProvider(configuration.wsRpcUrl);
  const api = new ApiPromise({ initWasm: false, provider });
  try {
    await api.isReady;
  } catch (e) {
    console.log("Api is ready with error:", e);
  }
  return api;
}

export const getApi = async (wallet: Wallet): Promise<ApiPromise> => {
  if (!api) {
    const configuration = getConfiguration(wallet);
    api = await initApi(configuration);
  } else {
    if(!provider.isConnected()) {
      await provider.connect();
    }
  }
  return api;
};