import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {MetamaskState} from "../../../../src/interfaces";
import {WalletMock} from "../../crypto/wallet.mock.test";
import {getBalance} from "../../../../src/rpc/substrate/getBalance";
import ApiPromise from "@polkadot/api/promise";
import { AccountInfo } from "@polkadot/types/interfaces/system";
import sinon from "sinon";
import {initApi} from "../../../../src/polkadot/initApi";
import { Keyring } from '@polkadot/api';
import axios from "axios";

chai.use(sinonChai);

describe('Test rpc handler function: getTransactions', () => {

  const walletStub = new WalletMock();

  afterEach(function () {
    walletStub.reset();
  });

});
