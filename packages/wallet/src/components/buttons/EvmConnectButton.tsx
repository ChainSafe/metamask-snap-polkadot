import { RepeatIcon } from '@chakra-ui/icons'
import { Button, ButtonGroup, IconButton, Text } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi'
import { useWallet } from '../../states/wallet'
import { CoinBase, MetaMask, WalletConnect } from '../icons'

interface ExtensionIconProps {
  extension: string
}

const ExtensionIcon: React.FC<ExtensionIconProps> = ({ extension }) => {
  switch (extension) {
    case 'metaMask':
      return <MetaMask width='24px' />
    case 'walletConnect':
      return <WalletConnect width='24px' />
    case 'coinbaseWallet':
      return <CoinBase width='24px' />
    default:
      return null
  }
}

interface EvmConnectButtonProps {
  connectorId: string
  label: string
  onClose?: () => void
}

export const EvmConnectButton: React.FC<EvmConnectButtonProps> = ({ connectorId, label, onClose }) => {
  const { isConnected, connector, address } = useAccount()
  const { connectors, connectAsync, reset } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const [isLoading, setIsLoading] = useState(false)
  const [connectorIdSelected, setConnectorIdSelected] = useState<string | null>(null)
  const { wallets, addWallet } = useWallet() // , saveWallet

  const handleConnect = useCallback(async () => {
    setIsLoading(true)
    try {
      isConnected && (await disconnectAsync())
      const connector = connectors.find((c) => c.id === connectorId)
      connector && (await connectAsync({ connector }))
      onClose && onClose()
    } catch (e) {
      console.error('e', e)
    }
    setConnectorIdSelected(connectorId)
    addWallet({
      name: connectorId,
      connector: connectorId,
      type: 'evm'
    })
    setIsLoading(false)
  }, [connectAsync, connectorId])

  const handleReset = useCallback(async () => {
    try {
      await reset()
    } catch (e) {
      console.error('e', e)
    }
    setIsLoading(false)
  }, [reset])

  return (
    <ButtonGroup size='sm' isAttached variant='outline' borderColor='brand'>
      <Button variant='outline' w='200px' borderColor='brand' onClick={handleConnect} isLoading={isLoading}>
        <ExtensionIcon extension={connectorId} />
        <Text ml='2'>{label}</Text>
      </Button>
      {isLoading && (
        <IconButton borderColor='brand' aria-label='Add to friends' icon={<RepeatIcon />} onClick={handleReset} />
      )}
    </ButtonGroup>
  )
}
