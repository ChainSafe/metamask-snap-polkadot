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
import {SnapConfig} from "./configuration/interfaces";
import {configure} from "./rpc/configure";
import {EventCallback, PolkadotEvent, polkadotEventEmitter} from "./polkadot/events";
import {registerOnBalanceChange} from "./polkadot/events/balance";

declare let wallet: Wallet;

const apiDependentMethods = ["getBlock", "getBalance", "getChainHead", "addKusamaAsset"];

wallet.registerApiRequestHandler(async function (fromOrigin: unknown) {
  const state = wallet.getPluginState();
  if (!state) {
    wallet.updatePluginState(EmptyMetamaskState());
  }
  return {
    on: (eventName: PolkadotEvent, callback: EventCallback): boolean => {
      switch (eventName) {
        case PolkadotEvent.OnBalanceChange:
          polkadotEventEmitter.addListener(PolkadotEvent.OnBalanceChange, callback);
          registerOnBalanceChange(wallet); // todo failing on this function call
          return true;
        default:
          throw new Error("");
      }
    }
  };
});

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  // console.log("RPC METHOD CALLED: " + requestObject.method);
  const state = wallet.getPluginState();
  if (!state) {
    // initialize state if empty and set default config
    wallet.updatePluginState(EmptyMetamaskState());
  }
  // fetch api promise
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
    case 'getBalance': {
      const balance = await getBalance(wallet, api);
      await updateAsset(wallet, originString, balance);
      return balance;
    }
    case 'configure': {
      const configuration = requestObject.params["configuration"] as SnapConfig;
      return configure(wallet, configuration.networkName, configuration);
    }
    case 'addPolkadotAsset':
      return await updateAsset(wallet, originString, 0);
    case 'removePolkadotAsset':
      return await removeAsset(wallet, originString);
    case 'getChainHead':
      // temporary method
      polkadotEventEmitter.emit(PolkadotEvent.OnBalanceChange, "100 KSM");
      const head = await api.rpc.chain.getFinalizedHead();
      return head.hash;
    default:
      throw new Error('Method not found.');
  }
});