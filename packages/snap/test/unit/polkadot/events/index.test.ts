import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";
import {getPolkadotEventEmitter} from "../../../../src/polkadot/events";

chai.use(sinonChai);

describe('Test polkadotEventEmitter', function () {

    describe('Single origin tests', function () {
        const callbackStub = sinon.stub();

        beforeEach(function () {
            callbackStub.returnsArg(0);
        });

        afterEach(function () {
            const eventEmitter = getPolkadotEventEmitter("origin1");
            eventEmitter.removeAllListeners("onBalanceChange");
            callbackStub.reset();
        });

        it('should call callback only when it is subscribed', function () {
            const eventEmitter = getPolkadotEventEmitter("origin1");
            eventEmitter.addListener(
                "onBalanceChange", callbackStub
            );
            eventEmitter.emit("onBalanceChange", "arg");
            expect(callbackStub).to.have.been.calledOnceWith("arg");
            eventEmitter.removeAllListeners("onBalanceChange");
            eventEmitter.emit("onBalanceChange", "arg");
            expect(callbackStub).to.have.been.calledOnce;
        });

        it('should call callback multiple times on mutiple emits', function () {
            const eventEmitter = getPolkadotEventEmitter("origin1");
            eventEmitter.addListener(
                "onBalanceChange", callbackStub
            );
            eventEmitter.emit("onBalanceChange", "arg");
            expect(callbackStub).to.have.been.calledOnceWith("arg");
            eventEmitter.emit("onBalanceChange", "arg");
            expect(callbackStub).to.have.been.calledTwice;
            eventEmitter.removeAllListeners("onBalanceChange");
            eventEmitter.emit("onBalanceChange", "arg");
            expect(callbackStub).to.have.been.calledTwice;
        });

        it('should call multiple callbacks on emit', function () {
            const eventEmitter = getPolkadotEventEmitter("origin1");
            eventEmitter.addListener(
                "onBalanceChange", callbackStub
            );
            // add second callback on same origin
            const additionalCallbackStub = sinon.stub();
            additionalCallbackStub.returnsArg(0);
            eventEmitter.addListener(
                "onBalanceChange", additionalCallbackStub
            );
            eventEmitter.emit("onBalanceChange", "arg");
            expect(callbackStub).to.have.been.calledOnceWith("arg");
            expect(additionalCallbackStub).to.have.been.calledOnceWith("arg");
        });

        it('should remove all callbacks on same origin', function () {
            const eventEmitter = getPolkadotEventEmitter("origin1");
            eventEmitter.addListener(
                "onBalanceChange", callbackStub
            );
            // add second callback on same origin
            const additionalCallbackStub = sinon.stub();
            additionalCallbackStub.returnsArg(0);
            eventEmitter.addListener(
                "onBalanceChange", additionalCallbackStub
            );
            eventEmitter.emit("onBalanceChange", "arg");
            expect(callbackStub).to.have.been.calledOnceWith("arg");
            expect(additionalCallbackStub).to.have.been.calledOnceWith("arg");
            eventEmitter.removeAllListeners("onBalanceChange");
            // callbacks are removed and wont be called second time
            eventEmitter.emit("onBalanceChange", "arg");
            expect(callbackStub).to.have.been.calledOnceWith("arg");
            expect(additionalCallbackStub).to.have.been.calledOnceWith("arg");
        });

        it('should fail to emit on no listeners subscribed', function () {
            const eventEmitter = getPolkadotEventEmitter("origin1");
            const success = eventEmitter.emit("onBalanceChange", "arg");
            expect(success).to.be.false;
        });

        describe('Multiple origins tests', function () {

            afterEach(function () {
                const eventEmitterForOrigin1 = getPolkadotEventEmitter("origin1");
                eventEmitterForOrigin1.removeAllListeners("onBalanceChange");
                const eventEmitterForOrigin2 = getPolkadotEventEmitter("origin2");
                eventEmitterForOrigin2.removeAllListeners("onBalanceChange");
            });

            it('should call only callback specific origin on emit', function () {
                const firstOriginCallback = sinon.stub();
                const eventEmitterForOrigin1 = getPolkadotEventEmitter("origin1");
                eventEmitterForOrigin1.addListener(
                    "onBalanceChange", firstOriginCallback
                );
                const secondOriginCallback = sinon.stub();
                const eventEmitterForOrigin2 = getPolkadotEventEmitter("origin2");
                eventEmitterForOrigin2.addListener(
                    "onBalanceChange", secondOriginCallback
                );
                eventEmitterForOrigin1.emit("onBalanceChange", "arg");
                expect(firstOriginCallback).to.have.been.calledOnceWith("arg");
                expect(secondOriginCallback).to.not.have.been.called;

                eventEmitterForOrigin2.emit("onBalanceChange", "arg");
                expect(firstOriginCallback).to.have.been.calledOnceWith("arg");
                expect(secondOriginCallback).to.have.been.calledOnceWith("arg");
            });


            it('should remove all listeners for one origin', function () {
                const eventEmitterForOrigin1 = getPolkadotEventEmitter("origin1");
                const firstOriginCallbackOne = sinon.stub();
                eventEmitterForOrigin1.addListener(
                    "onBalanceChange", firstOriginCallbackOne
                );
                const firstOriginCallbackTwo = sinon.stub();
                eventEmitterForOrigin1.addListener(
                    "onBalanceChange", firstOriginCallbackTwo
                );
                const eventEmitterForOrigin2 = getPolkadotEventEmitter("origin2");
                const secondOriginCallback = sinon.stub();
                eventEmitterForOrigin2.addListener(
                    "onBalanceChange", secondOriginCallback
                );

                eventEmitterForOrigin1.removeAllListeners("onBalanceChange");

                eventEmitterForOrigin1.emit("onBalanceChange", "arg");
                eventEmitterForOrigin2.emit("onBalanceChange", "arg");

                expect(firstOriginCallbackOne).not.to.have.been.called;
                expect(firstOriginCallbackTwo).not.to.have.been.called;
                expect(secondOriginCallback).to.have.been.calledOnceWith("arg");
            });
        });
    });
});
