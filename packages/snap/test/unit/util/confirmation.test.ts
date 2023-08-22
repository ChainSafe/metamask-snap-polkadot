import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { showConfirmationDialog } from '../../../src/util/confirmation';
import { panel, text } from '@metamask/snaps-ui';
import { getWalletMock } from '../wallet.mock';

chai.use(sinonChai);

describe('Test showConfirmationDialog', function () {
  const walletStub = getWalletMock();

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
