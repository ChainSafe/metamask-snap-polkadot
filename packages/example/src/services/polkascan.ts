export function getPolkascanTxUrl(txHash: string, network: string): string {
    return `${getPolkascanBaseUrl(network)}/transaction/${txHash}`;
}

export function getPolkascanAccUrl(address: string, network: string): string {
    return `${getPolkascanBaseUrl(network)}/account/${address}`;
}

export function getPolkascanBlockUrl(block: string, network: string) {
    return`${getPolkascanBaseUrl(network)}/block/${block}`;
}

function getPolkascanBaseUrl(network: string): string {
    switch (network) {
        case "kusama":
            return "https://polkascan.io/pre/kusama";
        case "westend":
            return "https://polkascan.io/pre/westend-m2";
        default:
            return "";
    }
}