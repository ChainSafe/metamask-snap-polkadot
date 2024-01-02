import { useEffect, useMemo, useState } from 'react'
import { useAccount, useBalance, useEnsName } from 'wagmi'
import { useExtension } from '../states/extension'
import { hexToFormattedNumber } from '../utils'

export const useWallet = (network: 'consensus' | 'evm') => {
  const [clientSide, setClientSide] = useState(false)
  // const [state] = useContext(MetaMaskContext)
  const { isConnected, address: addressEvm } = useAccount()
  const { data: balanceEVM } = useBalance({ address: addressEvm })
  const { data: ensName } = useEnsName({ address: addressEvm, chainId: 1 })
  const { subspaceAccount, accountDetails } = useExtension()

  const walletBalance = useMemo(() => {
    if (network === 'evm' && balanceEVM) return balanceEVM?.formatted
    else if (network === 'consensus' && accountDetails) return hexToFormattedNumber(accountDetails.data.free)
    return '0'
  }, [network, balanceEVM, accountDetails])

  const walletBalanceFormatted = useMemo(
    () =>
      walletBalance
        ? `${walletBalance.split('.')[0]}.${
            walletBalance.split('.')[1] ? walletBalance.split('.')[1].slice(0, 4) : '0000'
          }`
        : '0',
    [walletBalance]
  )

  const address = useMemo(() => {
    if (network === 'consensus') return subspaceAccount
    return addressEvm
  }, [network, addressEvm, subspaceAccount])

  const walletLabel = useMemo(() => {
    if (network === 'consensus' && address) return address.slice(0, 4) + '...' + address?.slice(-4)
    return ensName != null ? ensName : address?.slice(0, 4) + '...' + address?.slice(-4)
  }, [network, address, ensName])

  useEffect(() => {
    setClientSide(true)
  }, [])

  if (clientSide)
    return {
      walletLabel,
      walletBalance,
      walletBalanceFormatted,
      address
    }
  return {
    walletLabel: 'Connect Wallet',
    walletBalance: '0',
    address: null
  }
}
