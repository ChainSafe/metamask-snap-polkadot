import type {
  BlockInfo,
  MetamaskSubspaceRpcRequest,
  SignPayloadJSONRequest,
  SignPayloadRawRequest,
  SnapConfig,
  Transaction,
  TxPayload
} from '@subspace/metamask-subspace-types';
import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import type { MetamaskSubspaceSnap } from './snap';

async function sendSnapMethod(
  request: MetamaskSubspaceRpcRequest,
  snapId: string
): Promise<unknown> {
  console.info('sendSnapMethod', request, snapId);
  return await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      request,
      snapId
    }
  });
}

async function sign(
  this: MetamaskSubspaceSnap,
  method: 'signPayloadJSON' | 'signPayloadRaw',
  payload: SignerPayloadJSON | SignerPayloadRaw
): Promise<{ signature: string }> {
  return (await sendSnapMethod(
    {
      method,
      params: {
        payload
      }
    } as SignPayloadJSONRequest | SignPayloadRawRequest,
    this.snapId
  )) as { signature: string };
}

export async function signPayloadJSON(
  this: MetamaskSubspaceSnap,
  payload: SignerPayloadJSON
): Promise<string> {
  return (await sign.bind(this)('signPayloadJSON', payload)).signature;
}

export async function signPayloadRaw(
  this: MetamaskSubspaceSnap,
  payload: SignerPayloadRaw
): Promise<string> {
  return (await sign.bind(this)('signPayloadRaw', payload)).signature;
}

export async function getBalance(this: MetamaskSubspaceSnap): Promise<string> {
  return (await sendSnapMethod({ method: 'getBalance' }, this.snapId)) as string;
}

export async function getAddress(this: MetamaskSubspaceSnap): Promise<string> {
  return (await sendSnapMethod({ method: 'getAddress' }, this.snapId)) as string;
}

export async function getPublicKey(this: MetamaskSubspaceSnap): Promise<string> {
  return (await sendSnapMethod({ method: 'getPublicKey' }, this.snapId)) as string;
}

export async function exportSeed(this: MetamaskSubspaceSnap): Promise<string> {
  return (await sendSnapMethod({ method: 'exportSeed' }, this.snapId)) as string;
}

export async function setConfiguration(
  this: MetamaskSubspaceSnap,
  config: SnapConfig
): Promise<void> {
  await sendSnapMethod({ method: 'configure', params: { configuration: config } }, this.snapId);
}

export async function getLatestBlock(this: MetamaskSubspaceSnap): Promise<BlockInfo> {
  try {
    return (await sendSnapMethod(
      { method: 'getBlock', params: { blockTag: 'latest' } },
      this.snapId
    )) as BlockInfo;
  } catch (e) {
    console.log('Unable to fetch latest block', e);
    return { hash: '', number: '' };
  }
}

export async function getAllTransactions(this: MetamaskSubspaceSnap): Promise<Transaction[]> {
  return (await sendSnapMethod({ method: 'getAllTransactions' }, this.snapId)) as Transaction[];
}

export async function sendSignedData(
  this: MetamaskSubspaceSnap,
  signature: string,
  txPayload: TxPayload
): Promise<Transaction> {
  const response = await sendSnapMethod(
    {
      method: 'send',
      params: {
        signature,
        txPayload
      }
    },
    this.snapId
  );
  return response as Transaction;
}

export async function generateTransactionPayload(
  this: MetamaskSubspaceSnap,
  amount: string | number,
  to: string
): Promise<TxPayload> {
  return (await sendSnapMethod(
    { method: 'generateTransactionPayload', params: { amount, to } },
    this.snapId
  )) as TxPayload;
}
