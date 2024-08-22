import type { BlockId, TxPayload } from '@chainsafe/metamask-polkadot-types';
import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import {
  array,
  boolean,
  define,
  enums,
  number,
  object,
  optional,
  string,
  union
} from 'superstruct';
import type { Describe } from 'superstruct';

const HexStringStruct = define<`0x${string}`>('HexString', (value) => {
  return typeof value === 'string' && /^0x[0-9a-fA-F]+$/.test(value)
    ? true
    : 'Expected a valid hex string';
});

const SignaturePayloadJSONSchema = object({
  address: string(),
  blockHash: HexStringStruct, // HexString
  blockNumber: HexStringStruct, // HexString
  era: HexStringStruct, // HexString
  genesisHash: HexStringStruct, // HexString
  metadataHash: optional(HexStringStruct), // Optional HexString
  method: string(),
  mode: optional(number()), // mode is optional and can be a number
  nonce: HexStringStruct, // HexString
  specVersion: HexStringStruct, // HexString
  tip: HexStringStruct, // HexString
  transactionVersion: HexStringStruct, // HexString
  signedExtensions: array(string()),
  version: number(),
  withSignedTransaction: optional(boolean()) // Optional boolean
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const validSignPayloadJSONSchema: Describe<{
  payload: SignerPayloadJSON;
}> = object({
  payload: SignaturePayloadJSONSchema
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
    unit: { image: string; symbol: string; decimals: number };
    wsRpcUrl: string;
  };
}> = object({
  configuration: object({
    addressPrefix: optional(number()),
    networkName: string(),
    unit: optional(
      object({
        image: optional(string()),
        symbol: optional(string()),
        decimals: optional(number())
      })
    ),
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const validSendSchema: Describe<{
  signature: string;
  txPayload: TxPayload;
}> = object({
  signature: string(),
  txPayload: object({
    payload: SignaturePayloadJSONSchema,
    tx: string()
  })
});

export const validExportAccountSchema: Describe<{
  jsonPassphrase: string;
}> = object({
  jsonPassphrase: optional(string())
});
