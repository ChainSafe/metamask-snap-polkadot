import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type BaseWallet = {
  name: string
  connector: string
  type: 'evm' | 'substrate'
}

export interface Wallet extends BaseWallet {
  name: string
  address: string
  connector: string
  type: 'evm' | 'substrate'
  isConnecting: boolean
  isSnapEnabled: boolean
}

export type BaseToken = {
  chainId: number
  address: string
}

export interface Token extends BaseToken {
  chainLabel: string
  name: string
  symbol: string
  decimals: number
  isNative: boolean
}

export const initialBaseWallet: BaseWallet = {
  name: '',
  connector: '',
  type: 'evm'
}
export const initialWallet: Wallet = {
  ...initialBaseWallet,
  address: '',
  isConnecting: true,
  isSnapEnabled: false
}

export const initialBaseToken: BaseToken = {
  chainId: 1002,
  address: ''
}

export const initialToken: Token = {
  ...initialBaseToken,
  chainLabel: 'tSSC (EVM)',
  name: '',
  symbol: '',
  decimals: 18,
  isNative: false
}

interface WalletState {
  wallets: Wallet[]
  tokens: Token[]
  addWallet: (wallet: BaseWallet) => void
  // saveWallet: (wallet: Wallet) => void
  enableSnap: (walletAddress: `0x${string}` | undefined) => void
  isSnapEnable: (walletAddress: `0x${string}` | undefined) => boolean
  addToken: (token: Token) => void
  editToken: (token: Token) => void
  removeToken: (token: BaseToken) => void
  isTokenInList: (token: BaseToken) => boolean
}

export const useWallet = create<WalletState>()(
  persist(
    (set, get) => ({
      wallets: [],
      tokens: [],
      addWallet: (wallet) =>
        set((state) => ({
          wallets: [
            ...state.wallets,
            {
              ...initialWallet,
              ...wallet
            }
          ]
        })),
      // saveWallet: (wallet) =>
      //   set((state) => ({
      //     wallets: state.wallets.find((wallet) => wallet.address === '')
      //       ? [
      //           ...state.wallets.filter((wallet) => wallet.address !== ''),
      //           { ...state.wallets.find((wallet) => wallet.address === ''), address: wallet.address }
      //         ]
      //       : state.wallets.map((w) => {
      //           if (w.address === wallet.address) return wallet
      //           return w
      //         })
      //   })),
      enableSnap: (walletAddress) =>
        walletAddress &&
        set((state) => ({
          wallets: state.wallets.map((wallet) => {
            if (wallet.address === walletAddress) return { ...wallet, isSnapEnabled: true }
            return wallet
          })
        })),
      isSnapEnable: (walletAddress) => {
        const wallets = get().wallets
        return walletAddress
          ? wallets.find((wallet) => wallet.address === walletAddress)?.isSnapEnabled ?? false
          : false
      },
      addToken: (token) => set((state) => ({ tokens: [...state.tokens, token] })),
      editToken: (token) =>
        set((state) => ({
          tokens: state.tokens.map((t) => {
            if (t.address === token.address && t.chainId === token.chainId) return token
            return t
          })
        })),
      removeToken: (token) => {
        const allTokens = get().tokens
        const findToken = allTokens.find((t) => t.address === token.address && t.chainId === token.chainId)
        if (!findToken) return

        // build array without token found
        const newTokens = allTokens.filter((t) => allTokens.indexOf(t) !== allTokens.indexOf(findToken))

        set((state) => ({
          tokens: newTokens
        }))
      },
      isTokenInList: (token) => get().tokens.some((t) => t.address === token.address && t.chainId === token.chainId)
    }),
    {
      name: 'wallets',
      version: 1
    }
  )
)
