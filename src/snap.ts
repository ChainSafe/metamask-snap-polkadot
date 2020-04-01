import {emptyMetamaskState, Wallet} from "./interfaces";
import {getPublicKey} from "./rpc/getPublicKey";
import {exportSeed} from "./rpc/exportSeed";
import {getBalance} from "./rpc/substrate/getBalance";
import {getAddress} from "./rpc/getAddress";
import ApiPromise from "@polkadot/api/promise";
import {getTransactions} from "./rpc/substrate/getTransactions";
import {getBlock} from "./rpc/substrate/getBlock";
import {createPolkadotAsset} from "./asset/unit";
import {getApi} from "./polkadot/api";
import {Configuration, setConfiguration} from "./configuration/setConfiguration";

declare let wallet: Wallet;

const apiDependentMethods = ["getBlock", "getBalance", "getChainHead", "addDotAsset", "updateDotAsset"];

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