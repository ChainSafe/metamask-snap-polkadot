import {Injected, InjectedAccount, InjectedAccounts} from "@polkadot/extension-inject/types";
import {Signer as InjectedSigner} from '@polkadot/api/types';
import {configure, getAccountAddress, isPolkadotSnapInstalled,addKusamaAsset, 
  addPolkadotAsset, getBalance, getAddress, getPublicKey, exportSeed, installPolkadotSnap, 
  hasMetaMask, getLatestBlock, setConfiguration, getAllTransactions} from "./methods";
import {SnapConfig} from "@nodefactory/metamask-polkadot-types";
import {MetamaskSnapApi} from "./types";

export class MetamaskPolkadotSnap implements Injected {

  public accounts: InjectedAccounts = {
    get: async () => {
      const account: InjectedAccount = {
        address: await getAccountAddress(this.pluginOrigin),
        genesisHash: null,
        name: "Metamask account"
      };
      return [account];
    },
    subscribe: () => {
      return () => {
        throw "unsupported method";
      };
    }
  };

  public signer: InjectedSigner = {
    signPayload: async (_payload) => {
      return {id: 0, signature: ""};
    },
    signRaw: async (_raw) => {
      return {id: 0, signature: ""};
    },
    update: () => null
  };

  private readonly config: SnapConfig;
  private readonly pluginOrigin: string;

  public constructor(pluginOrigin: string, config: SnapConfig) {
    this.pluginOrigin = pluginOrigin;
    this.config = config || {networkName: "westend"};
  }

  public enableSnap = async (): Promise<Injected> => {

    if(await isPolkadotSnapInstalled(this.pluginOrigin)) {
      await window.ethereum.send({
        method: "wallet_enable",
        params: [{
          [this.pluginOrigin]: {}
        }]
      });
      await configure(this.pluginOrigin, this.config);
      await addPolkadotAsset(this.pluginOrigin);
    }
    return this;
  };

  public getMetamaskSnapApi = async (): Promise<MetamaskSnapApi> => {
    return {
      addKusamaAsset,
      addPolkadotAsset,
      exportSeed,
      getAccountAddress,
      getAddress,
      getAllTransactions,
      getBalance,
      getLatestBlock,
      getPublicKey,
      hasMetaMask,
      installPolkadotSnap,
      isPolkadotSnapInstalled,
      setConfiguration
    };
  };
}