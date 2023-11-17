export function getPolkascanTxUrl(txHash: string, network: string): string {
  switch (network) {
    case 'gemini-3g':
      return `https://subspace.subscan.io/extrinsic/${txHash}`;
    default:
      return '';
  }
}
