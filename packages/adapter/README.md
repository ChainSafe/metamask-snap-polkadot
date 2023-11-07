# Metamask <> Subspace snap adapter
![](https://github.com/subspace/metamask-snap-subspace/workflows/ci/badge.svg)
![](https://img.shields.io/github/license/subspace/metamask-snap-subspace)
![](https://img.shields.io/badge/yarn-%3E%3D1.17.0-orange.svg?style=flat-square)
![Discord](https://img.shields.io/discord/864285291518361610?color=blue&label=Discord&logo=discord)

Metamask <> Subspace snap adapter is used to inject [subspace snap](https://github.com/subspace/metamask-snap-subspace) as web3 provider. It lists snap inside `window.injectedWeb3["metamask-subspace-snap"]` so it can be enabled using `@polkadot/extension-dapp` package.  

For more details on subspace snap itself see [snap repo](https://github.com/subspace/metamask-snap-subspace) or read full [polkadot snap documentation](https://github.com/chainsafe/metamask-snap-polkadot/wiki).

## Usage

Adapter has only one exposed function for enabling snap as web3 provider.

```typescript
function enableSubspaceSnap(
  config?: SnapConfig,
  snapOrigin?: string,
  snapInstallationParams?: Record<SnapInstallationParamNames, unknown> = {}
): Promise<MetamaskSubspaceSnap>
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

SnapNetworks = "gemini-3f" | "gemini-3g" | "devNet";

UnitConfiguration {
  symbol: string;
  decimals: number;
  image?: string;
  customViewUrl?: string;
}
```

