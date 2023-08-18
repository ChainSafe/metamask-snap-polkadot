import type { MetamaskState } from '../interfaces';

export const getMetamaskState = async (): Promise<MetamaskState> => {
  const persistedData = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' }
  });

  if (!persistedData) return { config: null, transactions: [] };

  return persistedData as MetamaskState;
};
