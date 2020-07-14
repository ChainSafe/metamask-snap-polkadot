# Metamask <> Polkadot snap adapter
![](https://github.com/nodefactoryio/metamask-snap-polkadot/workflows/ci/badge.svg)
![](https://img.shields.io/github/license/nodefactoryio/metamask-snap-polkadot)
![](https://img.shields.io/badge/yarn-%3E%3D1.17.0-orange.svg?style=flat-square)
![Discord](https://img.shields.io/discord/608204864593461248?color=blue&label=Discord&logo=discord)

Metamask <> Polkadot snap adapter is used to inject [polkadot snap](https://github.com/NodeFactoryIo/metamask-snap-polkadot) as web3 provider. It lists snap inside `window.injectedWeb3["metamask-polkadot-snap"]` so it can be enabled using `@polkadot/extension-dapp` package.  

For more details on polkadot snap itself see [snap repo](https://github.com/NodeFactoryIo/metamask-snap-polkadot) or read full [polkadot snap documentation](https://github.com/NodeFactoryIo/metamask-snap-polkadot/wiki).

## Usage

Adapter has only one exposed function for injecting snap as web3 provider.

```typescript
function injectMetamaskPolkadotSnapProvider(
  network: "westend"|"kusama",
  config?: SnapConfig,
  pluginOrigin?: string
): void
```

If only `network` argument is provided, predefined configuration for specific network will be used. 
By providing `config` as argument it is possible to override default configurations.

Configuration structure is shown below.

```
SnapConfig {
  networkName: string;
  wsRpcUrl?: string;
  addressPrefix?: number;
  unit?: UnitConfiguration;
}

UnitConfiguration {
  symbol: string;
  decimals: number;
  image?: string;
  customViewUrl?: string;
}
```

