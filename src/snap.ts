import {EmptyMetamaskState, Wallet} from "./interfaces";
import {getPublicKey} from "./rpc/getPublicKey";
import {exportSeed} from "./rpc/exportSeed";
import {getBalance} from "./rpc/substrate/getBalance";
import {getAddress} from "./rpc/getAddress";
import ApiPromise from "@polkadot/api/promise";
import {getTransactions} from "./rpc/substrate/getTransactions";
import {getBlock} from "./rpc/substrate/getBlock";
import {removeAsset, updateAsset} from "./asset";
import {getApi} from "./polkadot/api";
import {Configuration, setConfiguration} from "./configuration/configuration";

declare let wallet: Wallet;

const apiDependentMethods = ["getBlock", "getBalance", "getChainHead", "addKusamaAsset"];

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  // initialize state if empty
  const state = wallet.getPluginState();
  if (!state) {
    wallet.updatePluginState(EmptyMetamaskState);
  }
  // fetch api promise
  let api: ApiPromise = null;
  if (apiDependentMethods.includes(requestObject.method)) {
    api = await getApi();
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
    case 'getBalance': {
      const balance = await getBalance(wallet, api);
      await updateAsset(wallet, originString, "ksm-token", balance);
      return balance;
    }
    case 'configure': {
      const configuration = requestObject.params["configuration"] as Configuration;
      return await setConfiguration(wallet, configuration);
    }
    case 'addKusamaAsset':
      return await updateAsset(wallet, originString, "ksm-token", 0);
    case 'removeKusamaAsset':
      return await removeAsset(wallet, originString, "ksm-token");
    case 'getChainHead':
      // temporary method
      const head = await api.rpc.chain.getFinalizedHead();
      return head.hash;
    default:
      throw new Error('Method not found.');
  }
});