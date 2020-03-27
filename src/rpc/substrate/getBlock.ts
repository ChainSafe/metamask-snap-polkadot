import ApiPromise from "@polkadot/api/promise";
import {SignedBlock} from '@polkadot/types/interfaces/runtime';
import { BlockHash } from '@polkadot/types/interfaces/rpc';

async function _getBlock(blockHash: BlockHash|string, api: ApiPromise): Promise<SignedBlock> {
  return api.rpc.chain.getBlock(blockHash);
}

interface GetBlockParams {
  blockId?: number;
  hash?: string;
}

export async function getBlock(requestParams: GetBlockParams, api: ApiPromise): Promise<SignedBlock> {
  if (requestParams.blockId) {
    const blockHash = await api.rpc.chain.getBlockHash(requestParams.blockId);
    if (!blockHash.isEmpty) {
      return await _getBlock(blockHash, api);
    }
  } else if (requestParams.hash) {
    return await _getBlock(requestParams.hash, api);
  }
  return null;
}


