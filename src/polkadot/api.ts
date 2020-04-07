import ApiPromise from "@polkadot/api/promise";
import {WsProvider} from "@polkadot/api";
import {NetworkConfiguration} from "../configuration/interfaces";
import {Wallet} from "../interfaces";

let api: ApiPromise;
let provider: WsProvider;

/**
 * Initialize substrate api and awaits for it to be ready
 */
async function initApi(config: NetworkConfiguration): Promise<ApiPromise> {
  provider = new WsProvider(config.wsRpcUrl);
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
    const state = wallet.getPluginState();
    api = await initApi(state.polkadot.config.network);
  } else {
    if(!provider.isConnected()) {
      await provider.connect();
    }
  }
  return api;
};