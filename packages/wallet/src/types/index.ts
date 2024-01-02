import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import type { OptionBase } from 'chakra-react-select'
import { TransactionStatus } from '../constants'
export * from './modal'

export type Network = 'consensus' | 'evm'

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

export type ExtensionState = {
  loading: boolean
  data?: {
    accounts: InjectedAccountWithMeta[]
    defaultAccount: InjectedAccountWithMeta
  }
  error: null | Error
}

export type AccountDetails = {
  nonce: number
  consumers: number
  providers: number
  sufficients: number
  data: {
    free: string
    reserved: string
    frozen: string
    flags: string
  }
}

export type ChainDetails = {
  chain: string
  name: string
  tokenDecimals: number
  tokenSymbol: string
  ss58Format: number
}

export type StakingConstants = {
  maxNominators: number
  minOperatorStake: bigint
  stakeEpochDuration: number
  stakeWithdrawalLockingPeriod: number
  domainRegistry: DomainRegistry[]
  domainStakingSummary: DomainStakingSummary[]
  operators: Operators[]
  nominators: Nominators[]
  pendingStakingOperationCount: PendingStakingOperationCount[]
  pendingDeposits: PendingDeposit[]
}

export type DomainRegistry = {
  domainId: string
  domainDetail: DomainRegistryDetail
}

export type DomainRegistryDetail = {
  ownerAccountId: string
  createdAt: number
  genesisReceiptHash: string
  domainConfig: {
    domainName: string
    runtimeId: number
    maxBlockSize: number
    maxBlockWeight: {
      refTime: number
      proofSize: string
    }
    bundleSlotProbability: number[]
    targetBundlesPerBlock: number
    operatorAllowList: {
      operators: string[]
    }
  }
}

export type DomainStakingSummary = {
  currentEpochIndex: number
  currentTotalStake: string
  currentOperators: {
    [key: string]: string
  }
  nextOperators: string[]
  currentEpochRewards: {
    [key: string]: string
  }
}

export type OperatorDetail = {
  signingKey: string
  currentDomainId: number
  nextDomainId: number
  minimumNominatorStake: string
  nominationTax: number
  currentTotalStake: string
  currentEpochRewards: number
  totalShares: string
  status: string
}

export type Operators = {
  operatorId: string
  operatorOwner: string
  operatorDetail: OperatorDetail
}

export type Nominators = {
  operatorId: string
  nominatorOwner: string
  shares: string
}

export type PendingStakingOperationCount = {
  [key: string]: number
}

export type Registration = {
  domainId: string
  minimumNominatorStake: string
  formattedMinimumNominatorStake: string
  amountToStake: string
  formattedAmountToStake: string
  nominatorTax: number
  signingKey: string
}

export type PendingDeposit = {
  operatorId: string
  operatorOwner: string
  amount: string
}

export interface Option<T> extends OptionBase {
  label: string
  value: T
}

export type NewTransaction = {
  chainId: number
  extrinsicHash: string
  method: string
  sender: string
  value: string
  fromBlockNumber: number
  fromBlockHash: string
  parameters?: string[]
}

export interface Transaction extends NewTransaction {
  network: Network
  status: TransactionStatus
  onBlockNumber?: number
  onBlockHash?: string
  onTimestamp?: number
  lastBlockNumber?: number
}

export type ErrorsField = {
  [key: string]: boolean
}

export type ActionInput = {
  operatorId: string
  amount: string
  formattedAmount: string
}

export type Error = {
  title: string
  description: string
}
