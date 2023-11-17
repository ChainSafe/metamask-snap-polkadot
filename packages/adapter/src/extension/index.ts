import type { Injected, InjectedAccount, InjectedWindow } from '@polkadot/extension-inject/types';
import type { SnapConfig } from '@subspace/metamask-subspace-types';
import type { SignerPayloadJSON, SignerPayloadRaw, SignerResult } from '@polkadot/types/types';
import type { HexString } from '@polkadot/util/types';
import type { SnapInstallationParamNames } from '../index';
import { enableSubspaceSnap } from '../index';
import { hasMetaMask, isMetamaskSnapsSupported } from '../utils';

interface Web3Window extends InjectedWindow {
  ethereum: unknown;
}

interface IEnableSubspaceSnapParams {
  config?: SnapConfig;
  snapOrigin?: string;
  snapInstallationParams?: Record<SnapInstallationParamNames, unknown>;
}

interface IInjectSubspaceSnap extends IEnableSubspaceSnapParams {
  win: Web3Window;
  injectedSnapId?: string;
}

function transformAccounts(accounts: string[]): InjectedAccount[] {
  return accounts.map((address, i) => ({
    address,
    name: `Subspace Snap #${i}`,
    type: 'ethereum'
  }));
}

function injectSubspaceSnap({
  win,
  injectedSnapId = 'metamask-subspace-snap',
  config,
  snapOrigin,
  snapInstallationParams
}: IInjectSubspaceSnap): void {
  win.injectedWeb3[injectedSnapId] = {
    enable: async (): Promise<Injected> => {
      const snap = (
        await enableSubspaceSnap(config, snapOrigin, snapInstallationParams)
      ).getMetamaskSnapApi();

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

/**
 * @param injectedSnapId - Optional ID of injected snap, default: "metamask-subspace-snap"
 */
export function initSubspaceSnap(
  { config, snapOrigin, snapInstallationParams }: IEnableSubspaceSnapParams,
  injectedSnapId?: string
): Promise<boolean> {
  return new Promise((resolve): void => {
    const win = window as Window & Web3Window;
    win.injectedWeb3 = win.injectedWeb3 || {};

    if (hasMetaMask())
      void isMetamaskSnapsSupported().then((result) => {
        if (result) {
          injectSubspaceSnap({ win, injectedSnapId, config, snapOrigin, snapInstallationParams });
          resolve(true);
        } else {
          resolve(false);
        }
      });
    else resolve(false);
  });
}
