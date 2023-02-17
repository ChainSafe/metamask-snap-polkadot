import { EmptyMetamaskState, MetamaskState } from "./interfaces";
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
import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { assert } from "superstruct";
import {
  validConfigureSchema,
  validGenerateTransactionPayloadSchema,
  validGetBlockSchema,
  validSendSchema,
  validSignPayloadJSONSchema,
  validSignPayloadRawSchema
} from "./util/validation";

const apiDependentMethods = [
  "getBlock", "getBalance", "getChainHead", "signPayloadJSON", "signPayloadRaw", "generateTransactionPayload", "send"
];
// eslint-disable-next-line
export const onRpcRequest: OnRpcRequestHandler = (async ({ request }) => {
  const state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });

  if (!state) {
    // initialize state if empty and set default config
    await snap.request({
      method: 'snap_manageState',
      params: { newState: EmptyMetamaskState(), operation: 'update' },
    });
  }
  // fetch api promise
  let api: ApiPromise = null;
  if (apiDependentMethods.includes(request.method)) {
    api = await getApi(snap);
  }

  switch (request.method) {
    case "signPayloadJSON":
      assert(request.params, validSignPayloadJSONSchema);
      return await signPayloadJSON(snap, api, request.params.payload);
    case "signPayloadRaw":
      assert(request.params, validSignPayloadRawSchema);
      return await signPayloadRaw(snap, api, request.params.payload);
    case 'getPublicKey':
      return await getPublicKey(snap);
    case 'getAddress':
      return await getAddress(snap);
    case 'exportSeed':
      return await exportSeed(snap);
    case 'getAllTransactions':
      return await getTransactions(snap);
    case 'getBlock':
      assert(request.params, validGetBlockSchema);
      return await getBlock(request.params.blockTag, api);
    case 'getBalance': {
      return await getBalance(snap, api);
    }
    case 'configure': {
      const state = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
      }) as MetamaskState;
      const isInitialConfiguration = state.polkadot.config === null;
      // reset api and remove asset only if already configured
      if (!isInitialConfiguration) {
        resetApi();
      }
      // set new configuration
      assert(request.params, validConfigureSchema);
      return await configure(
        snap, request.params.configuration.networkName, request.params.configuration
      );
    }
    case "generateTransactionPayload":
      assert(request.params, validGenerateTransactionPayloadSchema);
      return await generateTransactionPayload(snap, api, request.params.to, request.params.amount);

    case "send":
      assert(request.params, validSendSchema);
      return await send(
        snap,
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
