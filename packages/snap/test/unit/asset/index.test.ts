import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {Asset} from "../../../src/interfaces";
import {getPolkadotAssetDescription, POLKADOT_SNAP_ASSET_IDENTIFIER} from "../../../src/asset";
import {SnapConfig} from "@chainsafe/metamask-polkadot-types";

chai.use(sinonChai);

describe('Test asset functions ', function() {

  describe('getPolkadotAssetDescription', function () {

    it('should create asset description from configuration', async () => {
      const asset = getPolkadotAssetDescription(
        100,
        "test-address",
        { // configuration
          networkName: "westend",
          unit: {
            assetId: POLKADOT_SNAP_ASSET_IDENTIFIER,
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
        balance: "1.0000 m",
        customViewUrl: "custom-view",
        decimals: 0,
        identifier: POLKADOT_SNAP_ASSET_IDENTIFIER,
        image: "test-image",
        symbol: "TST"
      } as Asset);
    });

    it('should create asset description from configuration and set default values for missing properties', async () => {
      const asset = getPolkadotAssetDescription(
        100,
        "test-address",
        { // configuration
          networkName: "kusama",
          unit: {
            assetId: POLKADOT_SNAP_ASSET_IDENTIFIER,
            decimals: 5,
            symbol: "TST",
            // missing: image && customViewUrl
          }
        } as SnapConfig
      );
      // assertions
      expect(asset).not.to.be.null;
      expect(asset).to.be.deep.eq({
        balance: "1.0000 m",
        customViewUrl: "",
        decimals: 0,
        identifier: POLKADOT_SNAP_ASSET_IDENTIFIER,
        image: "",
        symbol: "TST"
      } as Asset);
    });
  });
});