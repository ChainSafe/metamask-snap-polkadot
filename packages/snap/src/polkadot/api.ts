import { getConfiguration } from '../configuration';
import { ApiPromise, WsProvider } from '@polkadot/api';

let api: ApiPromise;
let provider: WsProvider;
let isConnecting: boolean;

/**
 * Initialize substrate api and awaits for it to be ready
 */
async function initApi(wsRpcUrl: string): Promise<ApiPromise> {
  try {
    provider = new WsProvider(wsRpcUrl);
  } catch (error) {
    console.log('Error on provider creation', error);
  }
  console.log('Provider created', provider);
  const api = await ApiPromise.create({ provider });

  console.log('Api is ready', api);
  return api;
}

export const resetApi = (): void => {
  if (api && provider) {
    try {
      api.disconnect();
    } catch (e) {
      console.log('Error on api disconnect.');
    }
    api = null;
    provider = null;
  }
};

export const getApi = async (): Promise<ApiPromise> => {
  console.log('Getting api');
  if (!api) {
    // api not initialized or configuration changed
    const config = await getConfiguration();
    console.log('Config API', config);
    console.log('Connecting to', config.wsRpcUrl);
    console.log('initApi');
    api = await initApi(config.wsRpcUrl);
    console.log('API', api);
    isConnecting = false;
  } else {
    while (isConnecting) {
      await new Promise((r) => setTimeout(r, 100));
    }
    if (!provider.isConnected) {
      isConnecting = true;
      await provider.connect();
      isConnecting = false;
    }
  }
  return api;
};
