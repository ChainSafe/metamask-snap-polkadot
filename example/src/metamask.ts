declare var ethereum: {send: (params: any)=> Promise<{error: any}&any[]>};

export class Metamask {

    private initialized = false;

    constructor() {
    }

    public async init(): Promise<boolean> {
        console.log("initializing plugin", ethereum);
        if (typeof ethereum === 'undefined') {
            throw 'Please install MetaMask from metamask.io';
        }
        const origin = new URL('package.json', 'http://localhost:8081').toString();
        const pluginOrigin = `wallet_plugin_${origin}`;
        console.log("plugin origin", pluginOrigin);
        const result = await ethereum.send({
            method: 'wallet_requestPermissions',
            params: [{
                [pluginOrigin]: {}
            }]
        });
        console.log("result", result);
        this.initialized = !!result.length && !result.error;
        //TODO: request api
        return this.initialized;
    }

    public isInitialized(): boolean {
        return this.initialized;
    }
}