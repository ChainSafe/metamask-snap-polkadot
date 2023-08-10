import { ApiPromise } from '@polkadot/api';
import { getKeyPair } from '../../polkadot/account';
import { AccountData } from '@polkadot/types/interfaces/balances/types';
import { SnapsGlobalObject } from '@metamask/snaps-types';

/**
 * Returns balance as BN
 * @param snap
 * @param api
 * @param address
 */
export async function getBalance(
  snap: SnapsGlobalObject,
  api: ApiPromise,
  address?: string
): Promise<string> {
  if (!address) {
    address = (await getKeyPair(snap)).address;
  }

  const account = (await api.query.system.account(address)) as unknown as { data: AccountData };
  console.log('QUERY BALANCE', account);

  return account.data.free.toString();
}
