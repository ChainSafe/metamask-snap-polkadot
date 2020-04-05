import ApiPromise from "@polkadot/api/promise";
import {WsProvider} from "@polkadot/api";

let api: ApiPromise;
let provider: WsProvider;

/**
 * Initialize substrate api and awaits for it to be ready
 */
async function initApi(): Promise<ApiPromise> {
  provider = new WsProvider('wss://kusama-rpc.polkadot.io/');
  const api = new ApiPromise({ initWasm: false, provider });
  try {
    await api.isReady;
  } catch (e) {
    console.log("Api is ready with error:", e);
  }
  return api;
}

export const getApi = async (): Promise<ApiPromise> => {
  if (!api) {
    api = await initApi();
  } else {
    if(!provider.isConnected()) {
      await provider.connect();
    }
  }
  return api;
};