import {SnapConfig} from "@nodefactory/metamask-polkadot-types";

export function getPolkascanTxUrl(txHash: string, configuration: SnapConfig): string {
    return `${getPolkascanBaseUrl(configuration)}/transaction/${txHash}`;
}

export function getPolkascanAccUrl(address: string, configuration: SnapConfig): string {
    return `${getPolkascanBaseUrl(configuration)}/account/${address}`;
}

function getPolkascanBaseUrl(configuration: SnapConfig): string {
    switch (configuration.networkName) {
        case "kusama":
            return "https://polkascan.io/pre/kusama";
        case "westend":
            return "https://polkascan.io/pre/westend-m2";
        default:
            return ""
    }
}