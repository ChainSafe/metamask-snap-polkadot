import {Wallet} from "./interfaces";

declare var wallet: Wallet;

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
    switch (requestObject.method) {
        case 'hello':
            return wallet.send({
                method: 'alert',
                params: [`Hello, ${originString} from NodeFactory1!`]
            });
        default:
            throw new Error('Method not found.')
    }
});