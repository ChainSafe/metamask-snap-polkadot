import type {
  BlockInfo,
  MetamaskPolkadotRpcRequest,
  SignPayloadJSONRequest,
  SignPayloadRawRequest,
  SnapConfig,
  Transaction,
  TxPayload
} from '@chainsafe/metamask-polkadot-types';
import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import type { MetamaskPolkadotSnap } from './snap';

async function sendSnapMethod(
  request: MetamaskPolkadotRpcRequest,
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
  this: MetamaskPolkadotSnap,
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
  this: MetamaskPolkadotSnap,
  payload: SignerPayloadJSON
): Promise<string> {
  return (await sign.bind(this)('signPayloadJSON', payload)).signature;
}

export async function signPayloadRaw(
  this: MetamaskPolkadotSnap,
  payload: SignerPayloadRaw
): Promise<string> {
  return (await sign.bind(this)('signPayloadRaw', payload)).signature;
}

export async function getBalance(this: MetamaskPolkadotSnap): Promise<string> {
  return (await sendSnapMethod({ method: 'getBalance' }, this.snapId)) as string;
}

export async function getAddress(this: MetamaskPolkadotSnap): Promise<string> {
  return (await sendSnapMethod({ method: 'getAddress' }, this.snapId)) as string;
}

export async function getPublicKey(this: MetamaskPolkadotSnap): Promise<string> {
  return (await sendSnapMethod({ method: 'getPublicKey' }, this.snapId)) as string;
}

export async function exportSeed(this: MetamaskPolkadotSnap): Promise<string> {
  return (await sendSnapMethod({ method: 'exportSeed' }, this.snapId)) as string;
}

export async function setConfiguration(
  this: MetamaskPolkadotSnap,
  config: SnapConfig
): Promise<void> {
  await sendSnapMethod({ method: 'configure', params: { configuration: config } }, this.snapId);
}

export async function getLatestBlock(this: MetamaskPolkadotSnap): Promise<BlockInfo> {
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

export async function getAllTransactions(this: MetamaskPolkadotSnap): Promise<Transaction[]> {
  return (await sendSnapMethod({ method: 'getAllTransactions' }, this.snapId)) as Transaction[];
}

export async function sendSignedData(
  this: MetamaskPolkadotSnap,
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
  this: MetamaskPolkadotSnap,
  amount: string | number,
  to: string
): Promise<TxPayload> {
  return (await sendSnapMethod(
    { method: 'generateTransactionPayload', params: { amount, to } },
    this.snapId
  )) as TxPayload;
}
