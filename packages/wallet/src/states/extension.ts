import type { ApiPromise } from '@polkadot/api'
import { InjectedExtension } from '@polkadot/extension-inject/types'
import type { MetamaskSnapApi } from '@subspace/metamask-subspace-adapter/src/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TransactionStatus, initialChainDetails, initialExtensionValues, initialStakingConstants } from '../constants'
import {
  AccountDetails,
  ChainDetails,
  ExtensionState,
  Network,
  NewTransaction,
  StakingConstants,
  Transaction
} from '../types'

interface RegistrationState {
  api: ApiPromise | undefined
  mmApi: MetamaskSnapApi | undefined
  extension: ExtensionState
  subspaceAccount: string | undefined
  injectedExtension: InjectedExtension | undefined
  accountDetails: AccountDetails | undefined
  chainDetails: ChainDetails
  stakingConstants: StakingConstants
  setApi: (api: ApiPromise) => void
  setMMApi: (mmApi: MetamaskSnapApi) => void
  setExtension: (registration: ExtensionState) => void
  setSubspaceAccount: (subspaceAccount: string) => void
  setInjectedExtension: (injectedExtension: InjectedExtension) => void
  setAccountDetails: (accountDetails: AccountDetails) => void
  setChainDetails: (chainDetails: ChainDetails) => void
  setStakingConstants: (networkConstants: StakingConstants) => void
}

interface LastConnection {
  subspaceAccount: string | undefined
  novaAccount: string | undefined
  setSubspaceAccount: (subspaceAccount: string | undefined) => void
  setNovaAccount: (novaAccount: string | undefined) => void
}

interface TransactionsState {
  transactions: Transaction[]
  addTransactionToWatch: (network: Network, newTransaction: NewTransaction) => void
  changeTransactionStatus: (extrinsicHash: string, status: TransactionStatus) => void
  bumpLastBlockVerified: (extrinsicHash: string, lastBlockNumber: number) => void
  removeTransaction: (extrinsicHash: string) => void
}

export const useExtension = create<RegistrationState>((set) => ({
  api: undefined,
  mmApi: undefined,
  extension: initialExtensionValues,
  subspaceAccount: undefined,
  injectedExtension: undefined,
  accountDetails: undefined,
  chainDetails: initialChainDetails,
  stakingConstants: initialStakingConstants,
  setApi: (api) => set(() => ({ api })),
  setMMApi: (mmApi) => set(() => ({ mmApi })),
  setExtension: (extension) => set(() => ({ extension })),
  setSubspaceAccount: (subspaceAccount) => set(() => ({ subspaceAccount })),
  setInjectedExtension: (injectedExtension) => set(() => ({ injectedExtension })),
  setAccountDetails: (accountDetails) => set(() => ({ accountDetails })),
  setChainDetails: (chainDetails) => set(() => ({ chainDetails })),
  setStakingConstants: (stakingConstants) => set(() => ({ stakingConstants }))
}))

export const useLastConnection = create<LastConnection>()(
  persist(
    (set) => ({
      subspaceAccount: undefined,
      novaAccount: undefined,
      setSubspaceAccount: (subspaceAccount) => set(() => ({ subspaceAccount })),
      setNovaAccount: (novaAccount) => set(() => ({ novaAccount }))
    }),
    {
      name: 'lastConnection',
      version: 1
    }
  )
)

export const useTransactions = create<TransactionsState>()(
  persist(
    (set) => ({
      transactions: [],
      addTransactionToWatch: (network, newTransaction) =>
        set((state) => ({
          transactions: [
            ...state.transactions,
            {
              ...newTransaction,
              network,
              status: TransactionStatus.Pending,
              onTimestamp: Date.now()
            }
          ]
        })),
      changeTransactionStatus: (extrinsicHash, status) =>
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.extrinsicHash === extrinsicHash ? { ...transaction, status } : transaction
          )
        })),
      bumpLastBlockVerified: (extrinsicHash, lastBlockNumber) =>
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.extrinsicHash === extrinsicHash ? { ...transaction, lastBlockNumber } : transaction
          )
        })),
      removeTransaction: (extrinsicHash) =>
        set((state) => ({
          transactions: state.transactions.filter((transaction) => transaction.extrinsicHash !== extrinsicHash)
        }))
    }),
    {
      name: 'transactions',
      version: 2
    }
  )
)
