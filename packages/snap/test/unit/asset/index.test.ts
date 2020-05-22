import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {Asset} from "../../../src/interfaces";
import {getPolkadotAssetDescription} from "../../../src/asset";
import {SnapConfig} from "@nodefactory/metamask-polkadot-types";

chai.use(sinonChai);

describe('Test asset functions ', function() {

  describe('getPolkadotAssetDescription', function () {

    it('should create asset description from configuration', async () => {
      const asset = getPolkadotAssetDescription(
        100,
        "test-address",
        { // configuration
          networkName: "test-network",
          unit: {
            assetId: "polkadot-snap-asset",
            customViewUrl: "custom-view",
            decimals: 5,
            image: "test-image",
            symbol: "TST",
          }
        } as SnapConfig
      );
      // assertions
      expect(asset).not.to.be.null;
      expect(asset).to.be.deep.eq({
        balance: "1.000m",
        customViewUrl: "custom-view",
        decimals: 0,
        identifier: "polkadot-snap-asset",
        image: "test-image",
        symbol: "TST"
      } as Asset);
    });

    it('should create asset description from configuration and set default values for missing properties', async () => {
      const asset = getPolkadotAssetDescription(
        100,
        "test-address",
        { // configuration
          networkName: "test-network",
          unit: {
            assetId: "polkadot-snap-asset",
            decimals: 5,
            symbol: "TST",
            // missing: image && customViewUrl
          }
        } as SnapConfig
      );
      // assertions
      expect(asset).not.to.be.null;
      expect(asset).to.be.deep.eq({
        balance: "1.000m",
        customViewUrl: "https://polkascan.io/pre/test-network/account/test-address",
        decimals: 0,
        identifier: "polkadot-snap-asset",
        image: "",
        symbol: "TST"
      } as Asset);
    });
  });
});