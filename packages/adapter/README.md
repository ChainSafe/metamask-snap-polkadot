# Metamask <> Polkadot snap adapter
![](https://github.com/chainsafe/metamask-snap-polkadot/workflows/ci/badge.svg)
![](https://img.shields.io/github/license/chainsafe/metamask-snap-polkadot)
![](https://img.shields.io/badge/yarn-%3E%3D1.17.0-orange.svg?style=flat-square)
![Discord](https://img.shields.io/discord/608204864593461248?color=blue&label=Discord&logo=discord)

Metamask <> Polkadot snap adapter is used to inject [polkadot snap](https://github.com/chainsafe/metamask-snap-polkadot) as web3 provider. It lists snap inside `window.injectedWeb3["metamask-polkadot-snap"]` so it can be enabled using `@polkadot/extension-dapp` package.  

For more details on polkadot snap itself see [snap repo](https://github.com/chainsafe/metamask-snap-polkadot) or read full [polkadot snap documentation](https://github.com/chainsafe/metamask-snap-polkadot/wiki).

## Usage

Adapter has only one exposed function for enabling snap as web3 provider.

```typescript
function enablePolkadotSnap(
  config?: SnapConfig,
  snapOrigin?: string,
  snapInstallationParams?: Record<SnapInstallationParamNames, unknown> = {}
): Promise<MetamaskPolkadotSnap>
```

By providing `config` as argument it is possible to override default configurations.

Configuration structure is shown below.

```
SnapConfig {
  networkName: SnapNetworks;
  wsRpcUrl?: string;
  addressPrefix?: number;
  unit?: UnitConfiguration;
}

SnapNetworks = "polkadot" | "kusama" | "westend";

UnitConfiguration {
  symbol: string;
  decimals: number;
  image?: string;
  customViewUrl?: string;
}
```

