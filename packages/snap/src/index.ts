import { EmptyMetamaskState, MetamaskState, Wallet } from "./interfaces";
import { getPublicKey } from "./rpc/getPublicKey";
import { exportSeed } from "./rpc/exportSeed";
import { getBalance } from "./rpc/substrate/getBalance";
import { getAddress } from "./rpc/getAddress";
import { ApiPromise } from "@polkadot/api/promise";
import { getTransactions } from "./rpc/substrate/getTransactions";
import { getBlock } from "./rpc/substrate/getBlock";
import { getApi, resetApi } from "./polkadot/api";
import { configure } from "./rpc/configure";
import { signPayloadJSON, signPayloadRaw } from "./rpc/substrate/sign";
import { generateTransactionPayload } from "./rpc/generateTransactionPayload";
import { send } from "./rpc/send";

declare let wallet: Wallet;

const apiDependentMethods = [
  "getBlock", "getBalance", "getChainHead", "signPayloadJSON", "signPayloadRaw", "generateTransactionPayload", "send"
];
// eslint-disable-next-line
module.exports.onRpcRequest = (async ({ origin, request }: { origin: string, request: any }) => {
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
  if (apiDependentMethods.includes(request.method)) {
    api = await getApi(wallet);
  }

  switch (request.method) {
    case "signPayloadJSON":
      return await signPayloadJSON(wallet, api, request.params.payload);
    case "signPayloadRaw":
      return await signPayloadRaw(wallet, api, request.params.payload);
    case 'getPublicKey':
      return await getPublicKey(wallet);
    case 'getAddress':
      return await getAddress(wallet);
    case 'exportSeed':
      return await exportSeed(wallet);
    case 'getAllTransactions':
      return await getTransactions(wallet);
    case 'getBlock':
      return await getBlock(request.params.blockTag, api);
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
        wallet, request.params.configuration.networkName, request.params.configuration
      );
    }
    case "generateTransactionPayload":
      return await generateTransactionPayload(wallet, api, request.params.to, request.params.amount);

    case "send":
      return await send(
        wallet,
        api,
        (request.params.signature) as (Uint8Array | `0x${string}`),
        request.params.txPayload);

    case 'getChainHead':
      const head = await api.rpc.chain.getFinalizedHead();
      return head.hash;

    default:
      throw new Error('Method not found.');
  }
});
