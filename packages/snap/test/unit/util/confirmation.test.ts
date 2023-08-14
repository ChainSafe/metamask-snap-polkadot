import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { WalletMock } from '../wallet.mock.test';
import { showConfirmationDialog } from '../../../src/util/confirmation';
import { panel, text } from '@metamask/snaps-ui';

chai.use(sinonChai);

describe('Test showConfirmationDialog', function () {
  // eslint-disable-next-line
  // @ts-ignore
  const walletStub = global.snap as WalletMock;

  afterEach(() => {
    walletStub.reset();
  });

  it('should return true on positive confirmation', async function () {
    await showConfirmationDialog({
      description: 'description',
      prompt: 'confirmation',
      textAreaContent: 'textAreaContent'
    });

    expect(walletStub.request).to.have.been.calledOnceWith({
      method: 'snap_dialog',
      params: {
        content: panel([text('confirmation'), text('description'), text('textAreaContent')]),
        type: 'confirmation'
      }
    });
  });

  it('should return false on negative confirmation', async function () {
    await showConfirmationDialog({ prompt: 'confirmation' });

    expect(walletStub.request).to.have.been.calledOnceWith({
      method: 'snap_dialog',
      params: {
        content: panel([text('confirmation'), text(''), text('')]),
        type: 'confirmation'
      }
    });
  });
});
