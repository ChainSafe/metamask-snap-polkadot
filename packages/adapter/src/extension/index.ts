import type { Injected, InjectedAccount, InjectedWindow } from '@polkadot/extension-inject/types';
import type { SnapConfig } from '@subspace/metamask-subspace-types';
import type { SignerPayloadJSON, SignerPayloadRaw, SignerResult } from '@polkadot/types/types';
import type { HexString } from '@polkadot/util/types';
import { enableSubspaceSnap } from '../index';
import { hasMetaMask, isMetamaskSnapsSupported } from '../utils';

interface Web3Window extends InjectedWindow {
  ethereum: unknown;
}

const config: SnapConfig = {
  networkName: 'gemini-3g'
};

function transformAccounts(accounts: string[]): InjectedAccount[] {
  return accounts.map((address, i) => ({
    address,
    name: `Subspace Snap #${i}`,
    type: 'ethereum'
  }));
}

function injectSubspaceSnap(win: Web3Window): void {
  win.injectedWeb3.Snap = {
    enable: async (): Promise<Injected> => {
      const snap = (await enableSubspaceSnap(config)).getMetamaskSnapApi();

      return {
        accounts: {
          get: async (): Promise<InjectedAccount[]> => {
            const response = await snap.getAddress();
            return transformAccounts([response]);
          },
          // Currently there is only available only one account, in that case this method will never return anything
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          subscribe: (_cb: (accounts: InjectedAccount[]) => void): (() => void) => {
            return (): void => {};
          }
        },
        signer: {
          signPayload: async (payload: SignerPayloadJSON): Promise<SignerResult> => {
            const signature = (await snap.signPayloadJSON(payload)) as HexString;
            return { id: 0, signature };
          },
          signRaw: async (raw: SignerPayloadRaw): Promise<SignerResult> => {
            const signature = (await snap.signPayloadRaw(raw)) as HexString;
            return { id: 0, signature };
          }
        }
      };
    },
    version: '0'
  };
}

export function initSubspaceSnap(): Promise<boolean> {
  return new Promise((resolve): void => {
    const win = window as Window & Web3Window;
    win.injectedWeb3 = win.injectedWeb3 || {};

    if (hasMetaMask())
      void isMetamaskSnapsSupported().then((result) => {
        if (result) {
          injectSubspaceSnap(win);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    else resolve(false);
  });
}
