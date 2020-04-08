import {emptyMetamaskState, Wallet} from "./interfaces";
import {getPublicKey} from "./rpc/getPublicKey";
import {getBalance} from "./rpc/substrate/getBalance";
import {getBlock} from "./rpc/substrate/getBlock";
import {ApiPromise} from "@polkadot/api";
import {getApi} from "./polkadot/api";
import {getAddress} from "./rpc/getAddress";
import {exportSeed} from "./rpc/exportSeed";
import {getTransactions} from "./rpc/substrate/getTransactions";
import {Configuration, setConfiguration} from "./configuration/configuration";
import {createPolkadotAsset} from "./asset/unit";

declare let wallet: Wallet;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pingListeners: any[] = [];

const apiDependentMethods = ["getBlock", "getBalance", "getChainHead", "addDotAsset", "updateDotAsset"];

wallet.registerApiRequestHandler(async function (fromOrigin: unknown) {
  const state = wallet.getPluginState();
  if (!state) {
    wallet.updatePluginState(emptyMetamaskState);
  }
  return {
    getPublicKey: () => {
      pingListeners.forEach(callback => callback("argument pk"));
      return "pk";
    },
    on: (eventName: string, callback: unknown): boolean => {
      switch (eventName) {
        case 'pk':
          pingListeners.push(callback);
          return true;
        default:
          throw new Error("");
      }
    }
  };
});

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  // initialize state
  const state = wallet.getPluginState();
  if (!state) {
    wallet.updatePluginState(emptyMetamaskState);
  }
  // init api if needed
  let api: ApiPromise = null;
  if (apiDependentMethods.includes(requestObject.method)) {
    api = await getApi(wallet);
  }
  switch (requestObject.method) {
    case 'getPublicKey':
      return await getPublicKey(wallet);
    case 'getAddress':
      return await getAddress(wallet);
    case 'exportSeed':
      return await exportSeed(wallet);
    case 'getAllTransactions':
      return await getTransactions(wallet, requestObject.params["address"] as string);
    case 'getBlock':
      return await getBlock(requestObject.params, api);
    case 'getBalance':
      return await getBalance(wallet, api);
    case 'configure':
      return await setConfiguration(wallet, requestObject.params["configuration"] as Configuration);
    case 'addDotAsset':
      return await createPolkadotAsset(wallet, api, "add");
    case 'updateDotAsset':
      return await createPolkadotAsset(wallet, api, "update");
    case 'getChainHead':
      // temporary method
      const head = await api.rpc.chain.getFinalizedHead();
      return head.hash;
    default:
      throw new Error('Method not found.');
  }
});