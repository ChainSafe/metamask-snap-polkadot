import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {fromHexString, toHexString} from "../../../src/util/hex";

chai.use(sinonChai);

describe('Test util hex conversion functions:', () => {
  describe('fromHexString', function () {
    it('should parse valid hex string with 0x prefic', function () {
      const result = fromHexString("0x234a");
      expect(result).to.be.deep.eq(new Uint8Array(Array.from([35, 74])));
    });
    it('should parse valid hex string without 0x prefix', function () {
      const result = fromHexString("234a");
      expect(result).to.be.deep.eq(new Uint8Array(Array.from([35, 74])));
    });
    it('should be case insensitive', function () {
      const result = fromHexString("234A");
      expect(result).to.be.deep.eq(new Uint8Array(Array.from([35, 74])));
    });
    it('should throw error on invalid hex string length', function () {
      try {
        fromHexString("0x123");
      } catch (e) {
        expect(e).to.exist;
      }
    });
    it('should throw error on invalid hex string characters', function () {
      try {
        fromHexString("0xWWW");
      } catch (e) {
        expect(e).to.exist;
      }
    });
  });
  describe('toHexString', function () {
    it('should convert valid array to hex string', function () {
      const hexString = toHexString(new Uint8Array(Array.from([35, 74])));
      expect(hexString).to.be.eq("0x234a");
    });
  });
});