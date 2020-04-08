import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {getDefaultConfiguration} from "../../../src/configuration";
import {defaultConfiguration, kusamaConfiguration, westendConfiguration} from "../../../src/configuration/predefined";

chai.use(sinonChai);

describe('Test configuration functions', function() {
  describe('getDefaultConfiguration', function () {

    it('should return kusama configuration on "kusama"', function () {
      const configuration = getDefaultConfiguration("kusama");
      expect(configuration).to.be.deep.eq(kusamaConfiguration);
    });

    it('should return westend configuration on "westend"', function () {
      const configuration = getDefaultConfiguration("westend");
      expect(configuration).to.be.deep.eq(westendConfiguration);
    });

    it('should return default configuration on empty string', function () {
      const configuration = getDefaultConfiguration("");
      expect(configuration).to.be.deep.eq(defaultConfiguration);
    });

    it('should return default configuration on non network name string', function () {
      const configuration = getDefaultConfiguration("test");
      expect(configuration).to.be.deep.eq(defaultConfiguration);
    });
  });
});