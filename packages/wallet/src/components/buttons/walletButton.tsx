import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  AbsoluteCenter,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  Text
} from '@chakra-ui/react'
import { encodeAddress } from '@polkadot/keyring'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import React, { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useConnect } from '../../hooks/useConnect'
import { useAccountStatus } from '../../hooks/useNetwork'
import { useExtension } from '../../states/extension'
import { formatAddress } from '../../utils'
import { SubspaceWalletIcon } from '../icons'

interface ExtensionIconProps {
  extension: string
}

const SnapConnectorButton = dynamic(() => import('../buttons/snapConnectorButton').then((m) => m.SnapConnectorButton), {
  ssr: false
})
const EvmConnectButton = dynamic(() => import('../buttons/EvmConnectButton').then((m) => m.EvmConnectButton), {
  ssr: false
})
const SubConnectButton = dynamic(() => import('../buttons/SubConnectButton').then((m) => m.SubConnectButton), {
  ssr: false
})

const ExtensionIcon: React.FC<ExtensionIconProps> = ({ extension }) => {
  extension = extension.toLowerCase()
  switch (extension) {
    case 'polkadot-js':
      return <Image src={'/images/wallets/polkadot-dot.svg'} width={20} height={20} alt={'Polkadot.js'} />
    case 'subwallet-js':
      return <Image src={'/images/wallets/subwallet.svg'} width={20} height={20} alt={'Subwallet'} />
    case 'metamask':
      return <Image src={'/images/wallets/metamask.svg'} width={20} height={20} alt={'Metamask'} />
    default:
      return null
  }
}

export const WalletButton: React.FC = () => {
  const { address } = useAccountStatus()
  const { connector } = useAccount()
  const { extension, chainDetails } = useExtension()
  const { handleSelectWallet } = useConnect()
  const { ss58Format } = chainDetails

  const onClose = useCallback(() => {
    console.log('close')
  }, [])

  return (
    <Box position='relative' w={12} h='10vh' verticalAlign='center' m={4} p={2}>
      <AbsoluteCenter axis='vertical'>
        <Menu>
          <MenuButton as={Button} variant='outline' colorScheme='brand' rightIcon={<ChevronDownIcon />}>
            <SubspaceWalletIcon width='24px' height='24px' fill='#612893' />
          </MenuButton>
          <Portal>
            <MenuList>
              {extension && extension.data && extension.data.accounts.length > 0 && (
                <MenuGroup title='Gemini 3G'>
                  <MenuItem
                    key={`${extension.data.defaultAccount.meta.source}-${extension.data.defaultAccount.address}`}
                    _hover={{
                      bgGradient: 'linear(to-r, #A28CD2, #F4ABFD)'
                    }}>
                    <ExtensionIcon extension={extension.data.defaultAccount.meta.source} />
                    <Text ml='2'>
                      {`${
                        extension.data.defaultAccount.meta.name && `(${extension.data.defaultAccount.meta.name})`
                      } ${formatAddress(encodeAddress(extension.data.defaultAccount.address, ss58Format))}`}
                    </Text>
                  </MenuItem>
                  {extension.data.accounts
                    .filter((account) => account.address !== extension.data?.defaultAccount.address)
                    .map((account) => (
                      <MenuItem
                        key={`${account.meta.source}-${account.address}`}
                        onClick={() => handleSelectWallet(account.address)}
                        _hover={{
                          bgGradient: 'linear(to-r, #A28CD2, #F4ABFD)'
                        }}>
                        <ExtensionIcon extension={account.meta.source} />
                        <Text ml='2'>
                          {`${account.meta.name && `(${account.meta.name})`} ${formatAddress(
                            encodeAddress(account.address, ss58Format)
                          )}`}
                        </Text>
                      </MenuItem>
                    ))}
                </MenuGroup>
              )}
              <MenuDivider />
              {address && (
                <MenuGroup title='Nova - Gemini 3G EVM'>
                  <MenuItem>
                    {connector && <ExtensionIcon extension={connector.id} />}
                    <Text ml='2'>{`${address && `${formatAddress(address)}`}`}</Text>ª
                  </MenuItem>
                </MenuGroup>
              )}

              <MenuGroup title='Connect wallet'>
                <MenuItem>
                  <SnapConnectorButton onClose={onClose} />
                </MenuItem>
                <MenuItem>
                  <SubConnectButton connectorId='polkadot' label='SubWallet' onClose={onClose} />
                </MenuItem>
                <MenuItem>
                  <SubConnectButton connectorId='subwallet' label='SubWallet' onClose={onClose} />
                </MenuItem>
                <MenuItem>
                  <EvmConnectButton connectorId='metaMask' label='MetaMask' onClose={onClose} />
                </MenuItem>
                <MenuItem>
                  <EvmConnectButton connectorId='walletConnect' label='WalletConnect' onClose={onClose} />
                </MenuItem>
                <MenuItem>
                  <EvmConnectButton connectorId='coinbaseWallet' label='Coinbase' onClose={onClose} />
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Portal>
        </Menu>
      </AbsoluteCenter>
    </Box>
  )
}
