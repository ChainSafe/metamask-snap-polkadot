import { Chain, hardhat, mainnet } from 'wagmi/chains'

export const nova: Chain = {
  id: 1002,
  name: 'Gemini 3G Nova (EVM)',
  network: 'nova',
  nativeCurrency: {
    decimals: 18,
    name: 'tSSC',
    symbol: 'tSSC'
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_EVM_RPC_ENDPOINT || '']
    },
    public: {
      http: [process.env.NEXT_PUBLIC_EVM_RPC_ENDPOINT || '']
    }
  },
  blockExplorers: {
    default: {
      name: 'BlockScout',
      url: 'https://blockscout.subspace.network'
    }
  }
}

export const networksEVM: Chain[] = [nova, mainnet, hardhat]

export const gemini3g = {
  id: 0,
  name: 'Gemini 3G',
  nativeCurrency: {
    decimals: 18,
    name: 'tSSC',
    symbol: 'tSSC'
  }
}

export const networks = [gemini3g, nova]
