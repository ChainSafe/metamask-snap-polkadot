import {ApiPromise, WsProvider} from "@polkadot/api/";

(async function() {
  const provider = new WsProvider("wss://westend-rpc.polkadot.io");
  // const provider = new WsProvider("wss://kusama-rpc.polkadot.io");
  let api = new ApiPromise({ initWasm: false, provider, types: {RuntimeDbWeight: {
    read: 'Weight',
    write: 'Weight'
  }} });
  try {
    api = await api.isReady;
  } catch (e) {
    console.log("Api is ready with error:", e);
  }
})();