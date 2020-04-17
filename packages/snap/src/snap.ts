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
import {configure} from "./rpc/configure";
import {polkadotEventEmitter} from "./polkadot/events";
import {registerOnBalanceChange} from "./polkadot/events/balance";
import {EventCallback, PolkadotApi, PolkadotEvent} from "@nodefactory/metamask-polkadot-types";

declare let wallet: Wallet;

const apiDependentMethods = ["getBlock", "getBalance", "getChainHead", "addKusamaAsset"];

wallet.registerApiRequestHandler(async function (origin: string): Promise<PolkadotApi> {
  await registerOnBalanceChange(wallet, origin);
  return {
    on: (eventName: PolkadotEvent, callback: EventCallback): boolean => {
      switch (eventName) {
        case PolkadotEvent.OnBalanceChange:
          polkadotEventEmitter.addListener(PolkadotEvent.OnBalanceChange, origin, callback);
          return true;
        default:
          throw new Error(`Unsupported event: ${eventName}`);
      }
    },
    removeAllListeners: (eventName: PolkadotEvent): boolean => {
      polkadotEventEmitter.removeAllListeners(eventName, origin);
      return true;
    },
    removeListener: (eventName: PolkadotEvent, callback: EventCallback): boolean => {
      polkadotEventEmitter.removeListener(eventName, origin, callback);
      return true;
    }
  };
});

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
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
      return await getTransactions(wallet, requestObject.params.address);
    case 'getBlock':
      return await getBlock(requestObject.params.blockTag, api);
    case 'getBalance': {
      const balance = await getBalance(wallet, api);
      await updateAsset(wallet, originString, balance);
      return balance;
    }
    case 'configure': {
      return configure(wallet, requestObject.params.configuration.networkName, requestObject.params.configuration);
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