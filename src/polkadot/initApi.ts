import {ApiPromise, WsProvider} from "@polkadot/api";

export async function initApi(): Promise<ApiPromise> {
  const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/');
  const api = new ApiPromise({ initWasm: false, provider: wsProvider });
  try {
    await api.isReady;
  } catch (e) {
    console.log("ready", e);
  }
  return api;
}