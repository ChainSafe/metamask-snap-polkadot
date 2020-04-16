import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {PolkadotEvent, polkadotEventEmitter} from "../../../../src/polkadot/events";
import sinon from "sinon";

chai.use(sinonChai);

describe('Test polkadotEventEmitter', function() {

  describe('Single origin tests', function () {
    const callbackStub = sinon.stub();

    beforeEach(function () {
      callbackStub.returnsArg(0);
    });

    afterEach(function () {
      polkadotEventEmitter.removeAllListeners(PolkadotEvent.OnBalanceChange, "origin1");
      callbackStub.reset();
    });

    it('should call callback only when it is subscribed', function() {
      polkadotEventEmitter.addListener(
        PolkadotEvent.OnBalanceChange, "origin1", callbackStub
      );
      polkadotEventEmitter.emit(PolkadotEvent.OnBalanceChange, "origin1", "arg");
      expect(callbackStub).to.have.been.calledOnceWith(["arg"]);
      polkadotEventEmitter.removeAllListeners(PolkadotEvent.OnBalanceChange, "origin1");
      polkadotEventEmitter.emit(PolkadotEvent.OnBalanceChange, "origin1", "arg");
      expect(callbackStub).to.have.been.calledOnce;
    });

    it('should call callback multiple times on mutiple emits', function() {
      polkadotEventEmitter.addListener(
        PolkadotEvent.OnBalanceChange, "origin1", callbackStub
      );
      polkadotEventEmitter.emit(PolkadotEvent.OnBalanceChange, "origin1", "arg");
      expect(callbackStub).to.have.been.calledOnceWith(["arg"]);
      polkadotEventEmitter.emit(PolkadotEvent.OnBalanceChange, "origin1", "arg");
      expect(callbackStub).to.have.been.calledTwice;
      polkadotEventEmitter.removeAllListeners(PolkadotEvent.OnBalanceChange, "origin1");
      polkadotEventEmitter.emit(PolkadotEvent.OnBalanceChange, "origin1", "arg");
      expect(callbackStub).to.have.been.calledTwice;
    });

    it('should call multiple callbacks on emit', function() {
      polkadotEventEmitter.addListener(
        PolkadotEvent.OnBalanceChange, "origin1", callbackStub
      );
      // add second callback on same origin
      const additionalCallbackStub = sinon.stub();
      additionalCallbackStub.returnsArg(0);
      polkadotEventEmitter.addListener(
        PolkadotEvent.OnBalanceChange, "origin1", additionalCallbackStub
      );
      polkadotEventEmitter.emit(PolkadotEvent.OnBalanceChange, "origin1", "arg");
      expect(callbackStub).to.have.been.calledOnceWith(["arg"]);
      expect(additionalCallbackStub).to.have.been.calledOnceWith(["arg"]);
    });

    it('should remove all callbacks on same origin', function() {
      polkadotEventEmitter.addListener(
        PolkadotEvent.OnBalanceChange, "origin1", callbackStub
      );
      // add second callback on same origin
      const additionalCallbackStub = sinon.stub();
      additionalCallbackStub.returnsArg(0);
      polkadotEventEmitter.addListener(
        PolkadotEvent.OnBalanceChange, "origin1", additionalCallbackStub
      );
      polkadotEventEmitter.emit(PolkadotEvent.OnBalanceChange, "origin1", "arg");
      expect(callbackStub).to.have.been.calledOnceWith(["arg"]);
      expect(additionalCallbackStub).to.have.been.calledOnceWith(["arg"]);
      polkadotEventEmitter.removeAllListeners(PolkadotEvent.OnBalanceChange, "origin1");
      // callbacks are removed and wont be called second time
      polkadotEventEmitter.emit(PolkadotEvent.OnBalanceChange, "origin1", "arg");
      expect(callbackStub).to.have.been.calledOnceWith(["arg"]);
      expect(additionalCallbackStub).to.have.been.calledOnceWith(["arg"]);
    });

    it('should fail to emit on no listeners subscribed', function () {
      const success = polkadotEventEmitter.emit(PolkadotEvent.OnBalanceChange, "origin1", "arg");
      expect(success).to.be.false;
    });
  });

  describe('Multiple origins tests', function () {

    afterEach(function () {
      polkadotEventEmitter.removeAllListeners(PolkadotEvent.OnBalanceChange, "origin1");
      polkadotEventEmitter.removeAllListeners(PolkadotEvent.OnBalanceChange, "origin2");
    });

    it('should call only callback specific origin on emit', function() {
      const firstOriginCallback = sinon.stub();
      polkadotEventEmitter.addListener(
        PolkadotEvent.OnBalanceChange, "origin1", firstOriginCallback
      );
      const secondOriginCallback = sinon.stub();
      polkadotEventEmitter.addListener(
        PolkadotEvent.OnBalanceChange, "origin2", secondOriginCallback
      );
      polkadotEventEmitter.emit(PolkadotEvent.OnBalanceChange, "origin1", "arg");
      expect(firstOriginCallback).to.have.been.calledOnceWith(["arg"]);
      expect(secondOriginCallback).to.not.have.been.called;

      polkadotEventEmitter.emit(PolkadotEvent.OnBalanceChange, "origin2", "arg");
      expect(firstOriginCallback).to.have.been.calledOnceWith(["arg"]);
      expect(secondOriginCallback).to.have.been.calledOnceWith(["arg"]);
    });



    it('should remove all listeners for one origin', function () {
      const firstOriginCallbackOne = sinon.stub();
      polkadotEventEmitter.addListener(
        PolkadotEvent.OnBalanceChange, "origin1", firstOriginCallbackOne
      );
      const firstOriginCallbackTwo = sinon.stub();
      polkadotEventEmitter.addListener(
        PolkadotEvent.OnBalanceChange, "origin1", firstOriginCallbackTwo
      );
      const secondOriginCallback = sinon.stub();
      polkadotEventEmitter.addListener(
        PolkadotEvent.OnBalanceChange, "origin2", secondOriginCallback
      );

      polkadotEventEmitter.removeAllListeners(PolkadotEvent.OnBalanceChange, "origin1");

      polkadotEventEmitter.emit(PolkadotEvent.OnBalanceChange, "origin1", "arg");
      polkadotEventEmitter.emit(PolkadotEvent.OnBalanceChange, "origin2", "arg");

      expect(firstOriginCallbackOne).not.to.have.been.called;
      expect(firstOriginCallbackTwo).not.to.have.been.called;
      expect(secondOriginCallback).to.have.been.calledOnceWith(["arg"]);
    });
  });
});
