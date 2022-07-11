import {EmptyMetamaskState, MetamaskState, Wallet} from "./interfaces";
import {getPublicKey} from "./rpc/getPublicKey";
import {exportSeed} from "./rpc/exportSeed";
import {getBalance} from "./rpc/substrate/getBalance";
import {getAddress} from "./rpc/getAddress";
import {ApiPromise} from "@polkadot/api/promise";
import {getTransactions} from "./rpc/substrate/getTransactions";
import {getBlock} from "./rpc/substrate/getBlock";
import {getApi, resetApi} from "./polkadot/api";
import {configure} from "./rpc/configure";
import {signPayloadJSON, signPayloadRaw} from "./rpc/substrate/sign";
import {generateTransactionPayload} from "./rpc/generateTransactionPayload";
import {send} from "./rpc/send";

declare let wallet: Wallet;

const apiDependentMethods = [
  "getBlock", "getBalance", "getChainHead", "signPayloadJSON", "signPayloadRaw", "generateTransactionPayload", "send"
];

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  const state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });

  if (!state) {
    // initialize state if empty and set default config
    await wallet.request({
      method: 'snap_manageState',
      params: ['update', EmptyMetamaskState()],
    });
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
      return await getBalance(wallet, api);
    }
    case 'configure': {
      const state = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      }) as MetamaskState;
      const isInitialConfiguration = state.polkadot.config === null;
      // reset api and remove asset only if already configured
      if (!isInitialConfiguration) {
        resetApi();
      }
      // set new configuration
      return await configure(
        wallet, requestObject.params.configuration.networkName, requestObject.params.configuration
      );
    }
    case "generateTransactionPayload":
      return await generateTransactionPayload(wallet, api, requestObject.params.to, requestObject.params.amount);

    case "send":
      return await send(
        wallet, 
        api, 
        (requestObject.params.signature) as (Uint8Array | `0x${string}`), 
        requestObject.params.txPayload);

    case 'getChainHead':
      const head = await api.rpc.chain.getFinalizedHead();
      return head.hash;

    default:
      throw new Error('Method not found.');
  }
});
