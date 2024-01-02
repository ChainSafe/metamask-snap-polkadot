import { RepeatIcon } from '@chakra-ui/icons'
import { Button, ButtonGroup, IconButton, Text } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { useConnect } from '../../hooks/useConnect'
import { useExtension } from '../../states/extension'
import { MetaMask, Polkadot, SubWallet } from '../icons'

interface ExtensionIconProps {
  extension: string
}

const ExtensionIcon: React.FC<ExtensionIconProps> = ({ extension }) => {
  switch (extension) {
    case 'metaMask':
      return <MetaMask width='24px' />
    case 'polkadot':
      return <Polkadot width='20px' />
    case 'subwallet':
      return <SubWallet width='24px' />
    default:
      return null
  }
}

interface ConnectButtonProps {
  connectorId: string
  label: string
  onClose?: () => void
}

export const SubConnectButton: React.FC<ConnectButtonProps> = ({ connectorId, label, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { extension, subspaceAccount, chainDetails } = useExtension((state) => state)
  const {
    handleSelectFirstWalletFromExtension,
    handleSelectWallet,
    handleDisconnect,
    handleConnect: handleConnectSubspace,
    onConnectOpen,
    isConnectOpen,
    onConnectClose
  } = useConnect()

  const handleConnect = useCallback(async () => {
    setIsLoading(true)
    onConnectOpen()
    handleConnectSubspace()
    try {
      onClose && onClose()
    } catch (e) {
      console.error('e', e)
    }
    setIsLoading(false)
  }, [connectorId])

  const handleReset = useCallback(async () => {
    setIsLoading(false)
  }, [])

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
