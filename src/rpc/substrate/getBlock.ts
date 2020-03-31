import ApiPromise from "@polkadot/api/promise";
import {SignedBlock} from '@polkadot/types/interfaces/runtime';
import { BlockHash } from '@polkadot/types/interfaces/rpc';

async function _getBlock(blockHash: BlockHash|string, api: ApiPromise): Promise<SignedBlock> {
  return api.rpc.chain.getBlock(blockHash);
}

async function _getBlockById(blockId: number, api: ApiPromise): Promise<SignedBlock> {
  const blockHash = await api.rpc.chain.getBlockHash(blockId);
  if (!blockHash.isEmpty) {
    return await _getBlock(blockHash, api);
  }
  return null;
}

interface GetBlockParams {
  blockTag?: number|string|"latest";
}

/**
 * Returns block based on blockTag passed as param.
 *
 * Supported tags are:
 *    block id    (as string or number)
 *    block hash  (as hex string starting with "0x")
 *    "latest"    (returning latest block)
 *
 * @param requestParams
 * @param api
 */
export async function getBlock(requestParams: GetBlockParams, api: ApiPromise): Promise<SignedBlock> {
  switch (typeof requestParams.blockTag) {
    case "number":
      // get block by id sent as number
      return await _getBlockById(requestParams.blockTag, api);
    case "string":
      if (requestParams.blockTag === "latest") {
        // get latest block
        const h = await api.rpc.chain.getHeader();
        return await _getBlock(h.hash, api);
      } else if (requestParams.blockTag.startsWith("0x")) {
        // get block by hash
        return await _getBlock(requestParams.blockTag, api);
      } else {
        // get block by id sent as string
        const blockId = parseInt(requestParams.blockTag);
        if (blockId) {
          return await _getBlockById(blockId, api);
        }
      }
  }
  return null;
}


