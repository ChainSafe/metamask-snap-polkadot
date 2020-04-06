import { injectExtension } from '@polkadot/extension-inject';

interface Injected {
    // the interface for Accounts, as detailed below
    readonly accounts: Accounts;
    // the standard Signer interface for the API, as detailed below
    readonly signer: Signer;
    // not injected as of yet, subscribable provider for polkadot-js API injection,
    // this can be passed to the API itself upon construction in the dapp
    // readonly provider?: Provider
}

interface Account {
    // ss-58 encoded address
    readonly address: string;
    // the genesisHash for this account (empty if applicable to all)
    readonly genesisHash?: string;
    // (optional) name for display
    readonly name?: string;
};

interface Accounts {
    // retrieves the list of accounts for right now
    get: () => Promise<Account[]>;
    // (optional) subscribe to all accounts, updating as they change
    subscribe?: (cb: (accounts: Account[]) => any) => () => void
}

function enableFn (originName: string): Promise<Injected> {

}

injectExtension(enableFn, { name: 'myExtension', version: '1.0.1' });


//export function injectMetamaskPolkadotProvider(network: "kusama"|"polkadot") {} 
//export function injectMetamaskPolkadotProvider(config: {explorerUrl, rpcUrl, unitName}) {}