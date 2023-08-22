import { WalletMock } from './unit/wallet.mock';

declare global {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let snap: WalletMock;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.snap = new WalletMock();

// eslint-disable-next-line mocha/no-top-level-hooks
afterEach(function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  global.snap.reset();
});
