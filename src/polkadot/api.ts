import ApiPromise from "@polkadot/api/promise";
import {WsProvider} from "@polkadot/api";
import {Wallet} from "../interfaces";
import {getConfiguration} from "../configuration/configuration";
import {NetworkConfiguration} from "../network/network";

let api: ApiPromise;

/**
 * Initialize substrate api and awaits for it to be ready
 */
async function initApi(configuration: NetworkConfiguration): Promise<ApiPromise> {
  const wsProvider = new WsProvider(configuration.wsRpcUrl);
  const api = new ApiPromise({ initWasm: false, provider: wsProvider });
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
  }
  return api;
};