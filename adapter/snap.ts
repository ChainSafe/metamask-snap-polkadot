import {Injected, InjectedAccounts, InjectedAccount} from "@polkadot/extension-inject/types";
import { Signer as InjectedSigner } from '@polkadot/api/types';
import {getAccountAddress, isPolkadotSnapInstalled, addKusamaAsset, 
    addPolkadotAsset, getBalance, getAddress, getPublicKey, exportSeed, installPolkadotSnap, 
    hasMetaMask, getLatestBlock, setConfiguration, getAllTransactions} from "./methods";
import {BlockInfo} from "../src/rpc/substrate/getBlock";
import {SnapConfig} from "../src/configuration/interfaces";

export interface NetworkConfig {
    explorerUrl: string;
    rpcUrl: string;
    unitName: string;
}

export interface MetamaskSnapApi {
    getAccountAddress(): Promise<string>;
    installPolkadotSnap(): Promise<boolean>;
    isPolkadotSnapInstalled(): Promise<boolean>;
    addKusamaAsset(): Promise<void>;
    addPolkadotAsset(): Promise<void>;
    getBalance(): Promise<string>;
    getAddress(): Promise<string>;
    getPublicKey(): Promise<string>;
    exportSeed(): Promise<string>;
    hasMetaMask(): boolean;
    getLatestBlock(): Promise<BlockInfo>;
    setConfiguration(configuration: SnapConfig): Promise<void>;
    getAllTransactions(): Promise<any>;
}

export class MetamaskPolkadotSnap implements Injected {

    public accounts: InjectedAccounts = {
        get: async () => {
            const account: InjectedAccount = {
               address: await getAccountAddress(),
               genesisHash: null,
               name: "Metamask account"
            }
            return [account];
            },
        subscribe: () => {
            const unsubCall = () => {};
            return unsubCall;
            }
    }
    public signer: InjectedSigner;
    
    //TODO
    constructor(network: string, config: NetworkConfig) {

    };

    public enableSnap = async (origin?: string): Promise<Injected> => {
        const defaultOrigin = new URL('package.json', 'http://localhost:8081').toString();
        const defaultPluginOrigin = `wallet_plugin_${defaultOrigin}`;

        if(isPolkadotSnapInstalled) {
            await window.ethereum.send({
                method: "wallet_enable",
                params: [{
                    [origin || defaultPluginOrigin]: {}
                }]
            });
            addKusamaAsset();
        }
        return this;
    }

    public getMetamaskSnapApi = async (): Promise<MetamaskSnapApi> => {
        return {
            getAccountAddress,
            installPolkadotSnap,
            isPolkadotSnapInstalled,
            addKusamaAsset,
            addPolkadotAsset,
            getBalance,
            getAddress,
            getPublicKey,
            exportSeed,
            hasMetaMask,
            getLatestBlock,
            setConfiguration,
            getAllTransactions
        }
    }
}