import type { BlockId, TxPayload } from '@subspace/metamask-subspace-types';
import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import type { Describe } from 'superstruct';
import { array, enums, number, object, optional, string, type, union } from 'superstruct';

const SignaturePayloadJSONSchema = type({
  address: string(),
  blockHash: string(),
  blockNumber: string(),
  era: string(),
  genesisHash: string(),
  method: string(),
  nonce: string(),
  signedExtensions: array(string()),
  specVersion: string(),
  tip: string(),
  transactionVersion: string(),
  version: number()
});

export const validSignPayloadJSONSchema: Describe<{
  payload: SignerPayloadJSON;
}> = object({
  payload: SignaturePayloadJSONSchema as Describe<SignerPayloadJSON>
});

export type SignPayloadRawTypes = 'bytes' | 'payload';
export const SignPayloadRawTypesSchema: Describe<SignPayloadRawTypes> = enums(['bytes', 'payload']);

export const validSignPayloadRawSchema: Describe<{
  payload: SignerPayloadRaw;
}> = object({
  payload: object({
    address: string(),
    data: string(),
    type: SignPayloadRawTypesSchema
  })
});

export const validGetBlockSchema: Describe<{ blockTag: BlockId }> = object({
  blockTag: union([string(), number()])
});

export const validConfigureSchema: Describe<{
  configuration: {
    addressPrefix: number;
    networkName: string;
    unit: { image: string; symbol: string };
    wsRpcUrl: string;
  };
}> = object({
  configuration: object({
    addressPrefix: optional(number()),
    networkName: string(),
    unit: optional(object({ image: string(), symbol: string() })),
    wsRpcUrl: optional(string())
  })
});

export const validGenerateTransactionPayloadSchema: Describe<{
  to: string;
  amount: string | number;
}> = object({
  amount: union([string(), number()]),
  to: string()
});

export const validSendSchema: Describe<{
  signature: string;
  txPayload: TxPayload;
}> = object({
  signature: string(),
  txPayload: object({
    payload: SignaturePayloadJSONSchema,
    tx: string()
  }) as Describe<TxPayload>
});
