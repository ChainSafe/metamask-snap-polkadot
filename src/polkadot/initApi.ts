import {ApiPromise, WsProvider} from "@polkadot/api";
import {Wallet} from "../interfaces";
import {Metadata} from "@polkadot/types";

export async function initApi(wallet: Wallet): Promise<ApiPromise> {
  const stateMetadata = JSON.parse(wallet.getPluginState().polkadot.metadata) as Metadata;
  const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/');
  const api = new ApiPromise({ initWasm: false, provider: wsProvider });
  api.injectMetadata(stateMetadata);
  console.log(stateMetadata);
  try {
    await api.isReady;
    console.log("Api is ready.");
  } catch (e) {
    console.log("Api is ready with error:", e);
  }
  return api;
}