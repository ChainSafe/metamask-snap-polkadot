import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'
import { initialExtensionValues } from '../constants'
import { networks } from '../constants/networks'
import { useExtension, useLastConnection } from '../states/extension'
import { useWallet } from '../states/wallet'

export const useCurrentNetwork = () => {
  const [clientSide, setClientSide] = useState(false)
  const { wallets } = useWallet()

  useEffect(() => {
    setClientSide(true)
  }, [])

  const { chain } = useNetwork()
  const { address } = useAccount()

  const walletByAddress = useMemo(
    () => (addressInput: string) => wallets.find((wallet) => wallet.address === addressInput),
    [wallets]
  )
  const networkById = useMemo(() => (id: number) => networks.find((network) => network.id === id), [networks])

  const currentNetwork = useMemo(
    () =>
      clientSide &&
      chain &&
      address &&
      (walletByAddress(address) && walletByAddress(address)?.isSnapEnabled ? networkById(0) : networkById(chain?.id)),
    [chain, address, wallets]
  )
  const currentNetworkName = useMemo(() => (currentNetwork ? currentNetwork.name : 'Network'), [currentNetwork])
  return { currentNetwork, currentNetworkName }
}

export const useAccountStatus = () => {
  const { isConnected: isConnectedEvm, address } = useAccount()
  const { subspaceAccount } = useExtension()

  const { currentNetwork } = useCurrentNetwork()

  const isConnected = useMemo(() => isConnectedEvm && subspaceAccount, [isConnectedEvm, subspaceAccount])

  return { isConnected, address, currentNetwork }
}

export const useDisconnectAll = () => {
  const { setExtension } = useExtension()
  const { setSubspaceAccount: setLastSubspaceAccount } = useLastConnection()
  const { disconnectAsync } = useDisconnect()

  const disconnectAll = useCallback(async () => {
    await disconnectAsync()
    setExtension(initialExtensionValues)
    setLastSubspaceAccount(undefined)
  }, [disconnectAsync])

  return { disconnectAll }
}
