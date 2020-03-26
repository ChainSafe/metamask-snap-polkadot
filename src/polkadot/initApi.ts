import {ApiPromise, WsProvider} from "@polkadot/api";

/**
 * Initialize substrate api and awaits for it to be ready
 */
export async function initApi(): Promise<ApiPromise> {
  const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/');
  const api = new ApiPromise({ initWasm: false, provider: wsProvider });
  try {
    await api.isReady;
    console.log("Api is ready.");
  } catch (e) {
    console.log("Api is ready with error:", e);
  }
  return api;
}