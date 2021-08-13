import {EmptyMetamaskState, Wallet} from "./interfaces";
import {getPublicKey} from "./rpc/getPublicKey";
import {exportSeed} from "./rpc/exportSeed";
import {getBalance} from "./rpc/substrate/getBalance";
import {getAddress} from "./rpc/getAddress";
import ApiPromise from "@polkadot/api/promise";
import {getTransactions} from "./rpc/substrate/getTransactions";
import {getBlock} from "./rpc/substrate/getBlock";
import {updateAsset} from "./asset";
import {getApi, resetApi} from "./polkadot/api";
import {configure} from "./rpc/configure";
import {getPolkadotEventEmitter, getTxEventEmitter} from "./polkadot/events";
import {registerOnBalanceChange, removeOnBalanceChange} from "./polkadot/events/balance";
import {HexHash, PolkadotApi, PolkadotEventCallback, TxEventCallback} from "@chainsafe/metamask-polkadot-types";
import {signPayloadJSON, signPayloadRaw} from "./rpc/substrate/sign";
import {generateTransactionPayload} from "./rpc/generateTransactionPayload";
import {send} from "./rpc/send";

declare let wallet: Wallet;

const apiDependentMethods = [
  "getBlock", "getBalance", "getChainHead", "signPayloadJSON", "signPayloadRaw", "generateTransactionPayload", "send"
];

wallet.registerApiRequestHandler(async function (origin: URL): Promise<PolkadotApi> {
  return {
    subscribeToBalance: (callback: PolkadotEventCallback): void => {
      const eventEmitter = getPolkadotEventEmitter(origin.hostname);
      eventEmitter.addListener("onBalanceChange", callback);
      // first call or first call after unregistering
      if (eventEmitter.listenerCount("onBalanceChange") === 1) {
        registerOnBalanceChange(wallet, origin.hostname);
      }
    },
    subscribeToTxStatus: (hash: HexHash, onIncluded: TxEventCallback, onFinalized?: TxEventCallback): void => {
      const eventEmitter = getTxEventEmitter(hash);
      eventEmitter.addListener("included", onIncluded);
      if (onFinalized) {
        eventEmitter.addListener("finalized", onFinalized);
      }
    },
    unsubscribeAllFromBalance: (): void => {
      const eventEmitter = getPolkadotEventEmitter(origin.hostname);
      eventEmitter.removeAllListeners("onBalanceChange");
      removeOnBalanceChange(origin.hostname);
    },
    unsubscribeFromBalance: (callback: PolkadotEventCallback): void => {
      const eventEmitter = getPolkadotEventEmitter(origin.hostname);
      eventEmitter.removeListener("onBalanceChange", callback);
      if (eventEmitter.listenerCount("onBalanceChange") === 0) {
        removeOnBalanceChange(origin.hostname);
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
      return await getTransactions(wallet);
    case 'getBlock':
      return await getBlock(requestObject.params.blockTag, api);
    case 'getBalance': {
      const balance = await getBalance(wallet, api);
      await updateAsset(wallet, originString, balance);
      return balance;
    }
    case 'configure': {
      const isInitialConfiguration = wallet.getPluginState().polkadot.config === null;
      // reset api and remove asset only if already configured
      if (!isInitialConfiguration) {
        resetApi();
      }
      // set new configuration
      const configuration = configure(
        wallet, requestObject.params.configuration.networkName, requestObject.params.configuration
      );
      // initialize api with new configuration
      api = await getApi(wallet);
      // add new asset
      const balance = await getBalance(wallet, api);
      await updateAsset(wallet, originString, balance);
      return configuration;
    }
    case "generateTransactionPayload":
      return await generateTransactionPayload(wallet, api, requestObject.params.to, requestObject.params.amount);
    case "send":
      return await send(wallet, api, requestObject.params.signature, requestObject.params.txPayload);
    case 'getChainHead':
      const head = await api.rpc.chain.getFinalizedHead();
      return head.hash;
    default:
      throw new Error('Method not found.');
  }
});