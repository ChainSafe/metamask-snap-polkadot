import {EmptyMetamaskState, Wallet} from "./interfaces";
import {getPublicKey} from "./rpc/getPublicKey";
import {exportSeed} from "./rpc/exportSeed";
import {getBalance} from "./rpc/substrate/getBalance";
import {getAddress} from "./rpc/getAddress";
import ApiPromise from "@polkadot/api/promise";
import {getTransactions} from "./rpc/substrate/getTransactions";
import {getBlock} from "./rpc/substrate/getBlock";
import {removeAsset, updateAsset} from "./asset";
import {getApi, resetApi} from "./polkadot/api";
import {configure} from "./rpc/configure";
import {polkadotEventEmitter, txEventEmitter} from "./polkadot/events";
import {registerOnBalanceChange, removeOnBalanceChange} from "./polkadot/events/balance";
import {EventCallback, HexHash, PolkadotApi} from "@nodefactory/metamask-polkadot-types";
import {signPayloadJSON, signPayloadRaw} from "./rpc/substrate/sign";
import {sendUnit} from "./rpc/substrate/sendUnit";

declare let wallet: Wallet;

const apiDependentMethods = [
  "getBlock", "getBalance", "getChainHead", "signPayloadJSON", "signPayloadRaw"
];

wallet.registerApiRequestHandler(async function (origin: string): Promise<PolkadotApi> {
  return {
    onTxFinalized: (callback: EventCallback, hash: HexHash): void => {
      txEventEmitter.addListener("finalized", hash, callback);
    },
    onTxInBlock: (callback: EventCallback, hash: HexHash): void => {
      txEventEmitter.addListener("inBlock", hash, callback);
    },
    subscribeToBalance: (callback: EventCallback): void => {
      polkadotEventEmitter.addListener("onBalanceChange", origin, callback);
      // first call or first call after unregistering
      if (polkadotEventEmitter.getListenersCount("onBalanceChange", origin) === 1) {
        registerOnBalanceChange(wallet, origin);
      }
    },
    unsubscribeAllFromBalance: () => {
      polkadotEventEmitter.removeAllListeners("onBalanceChange", origin);
      removeOnBalanceChange(origin);
    },
    unsubscribeFromBalance: (callback: EventCallback): void => {
      polkadotEventEmitter.removeListener("onBalanceChange", origin, callback);
      if (polkadotEventEmitter.getListenersCount("onBalanceChange", origin) === 0) {
        removeOnBalanceChange(origin);
      }
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
    case "signPayloadJSON":
      return await signPayloadJSON(wallet, api, requestObject.params.payload);
    case "signPayloadRaw":
      return await signPayloadRaw(wallet, api, requestObject.params.payload);
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
      resetApi();
      return configure(wallet, requestObject.params.configuration.networkName, requestObject.params.configuration);
    }
    case 'addPolkadotAsset':
      return await updateAsset(wallet, originString, 0);
    case 'removePolkadotAsset':
      return await removeAsset(wallet, originString);
    case "sendUnit":
      return await sendUnit(wallet, api, requestObject.params.amount, requestObject.params.to);
    case 'getChainHead':
      // temporary method
      polkadotEventEmitter.emit("onBalanceChange", "100 KSM");
      const head = await api.rpc.chain.getFinalizedHead();
      return head.hash;
    default:
      throw new Error('Method not found.');
  }
});