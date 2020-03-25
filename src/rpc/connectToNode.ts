import {Wallet} from "../interfaces";
import {ApiPromise, WsProvider} from "@polkadot/api";

export async function connectToNode(wallet: Wallet) {
  const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/');
  const api = new ApiPromise({ initWasm: false, provider: wsProvider });
  // wait for api
  try {
    await api.isReady;
    console.log("Api is ready.");
  } catch (e) {
    console.log("Api is ready with error:", e);
  }
  // convert metadata to string
  const metadata = api.runtimeMetadata.toJSON();
  const metadataAsString = JSON.stringify(metadata);
  // save metadata to state
  const state = wallet.getPluginState();
  console.log(metadataAsString);
  console.log(JSON.parse(metadataAsString));
  state.polkadot.metadata = metadataAsString;
  wallet.updatePluginState(state);
  return true;
}