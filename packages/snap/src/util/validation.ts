import type { BlockId } from '@chainsafe/metamask-polkadot-types';
import type { SignerPayloadRaw } from '@polkadot/types/types';
import type { Describe, Infer } from 'superstruct';
import {
  nullable,
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

const HexStringStruct = define<`0x${string}`>('HexString', (value) => {
  return typeof value === 'string' && /^0x[0-9a-fA-F]+$/.test(value)
    ? true
    : 'Expected a valid hex string';
});

// SignerPayloadJSON from '@polkadot/types/types';
const SignaturePayloadJSONSchema = object({
  address: string(),
  assetId: nullable(optional(union([number(), object()]))),
  blockHash: HexStringStruct,
  blockNumber: HexStringStruct,
  era: HexStringStruct,
  genesisHash: HexStringStruct,
  metadataHash: nullable(optional(HexStringStruct)),
  method: string(),
  mode: nullable(optional(number())),
  nonce: HexStringStruct,
  specVersion: HexStringStruct,
  tip: HexStringStruct,
  transactionVersion: HexStringStruct,
  signedExtensions: array(string()),
  version: number(),
  withSignedTransaction: nullable(optional(boolean()))
});

type SignaturePayloadJSONType = Infer<typeof SignaturePayloadJSONSchema>;

export const validSignPayloadJSONSchema: Describe<{
  payload: SignaturePayloadJSONType;
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

export const validSendSchema: Describe<{
  signature: string;
  txPayload: {
    tx: string;
    payload: SignaturePayloadJSONType;
  };
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
