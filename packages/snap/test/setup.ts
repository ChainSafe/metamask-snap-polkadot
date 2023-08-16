import { WalletMock } from './unit/wallet.mock';

declare global {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let snap: WalletMock;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.snap = new WalletMock();

afterEach(function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.snap.reset();
});
