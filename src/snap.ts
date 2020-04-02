import {emptyMetamaskState, Wallet} from "./interfaces";
import {getPublicKey} from "./rpc/getPublicKey";
import {getBalance} from "./rpc/substrate/getBalance";
import {getBlock} from "./rpc/substrate/getBlock";

declare let wallet: Wallet;

const apiDependentMethods = ["getBlock", "getBalance", "getChainHead", "addDotAsset", "updateDotAsset"];

wallet.registerApiRequestHandler(async function (fromOrigin: unknown) {
  const state = wallet.getPluginState();
  if (!state) {
    wallet.updatePluginState(emptyMetamaskState);
  }
  return {
    getPublicKey: async () => {
      console.log("API INVOCATION");
      console.log(Date.now());
      const pk = await getPublicKey(wallet);
      console.log(Date.now());
      return pk;
    }
  };
});

// wallet.registerRpcMessageHandler(async (originString, requestObject) => {
//   // initialize state
//   const state = wallet.getPluginState();
//   if (!state) {
//     wallet.updatePluginState(emptyMetamaskState);
//   }
//   // init api if needed
//   let api: ApiPromise = null;
//   if (apiDependentMethods.includes(requestObject.method)) {
//     api = await getApi(wallet);
//   }
//   switch (requestObject.method) {
//     case 'getPublicKey':
//       return await getPublicKey(wallet);
//     case 'getAddress':
//       return await getAddress(wallet);
//     case 'exportSeed':
//       return await exportSeed(wallet);
//     case 'getAllTransactions':
//       return await getTransactions(wallet, requestObject.params["address"] as string);
//     case 'getBlock':
//       return await getBlock(requestObject.params, api);
//     case 'getBalance':
//       return await getBalance(wallet, api);
//     case 'configure':
//       return await setConfiguration(wallet, requestObject.params["configuration"] as Configuration);
//     case 'addDotAsset':
//       return await createPolkadotAsset(wallet, api, "add");
//     case 'updateDotAsset':
//       return await createPolkadotAsset(wallet, api, "update");
//     case 'getChainHead':
//       // temporary method
//       const head = await api.rpc.chain.getFinalizedHead();
//       return head.hash;
//     default:
//       throw new Error('Method not found.');
//   }
// });