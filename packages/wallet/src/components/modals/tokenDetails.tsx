import {
  Button,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack
} from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { useWallet } from '../../hooks/useWallet'
import { useView } from '../../states/view'
import type { Token } from '../../states/wallet'
import { ModalProps } from '../../types'

interface TokenDetailsProps extends ModalProps {
  token: Token | null
}

export const TokenDetails: React.FC<TokenDetailsProps> = ({ isOpen, onClose, token }) => {
  const { network } = useView()
  const { walletLabel, address } = useWallet(network)

  const handleOnClose = useCallback(() => {
    onClose()
  }, [onClose])

  if (!token) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Token details</ModalHeader>
        <ModalBody>
          <Grid gap={2} templateColumns='repeat(1, 1fr)'>
            <GridItem>
              <Text>Token name:</Text>
              <Text size='xs'>{token.name}</Text>
            </GridItem>
            <GridItem>
              <Text>Token symbol:</Text>
              <Text size='xs'>{token.symbol}</Text>
            </GridItem>
            <GridItem>
              <Text>Token address:</Text>
              <Text size='xs'>{token.address}</Text>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='brand' mr={3} onClick={handleOnClose} variant='outline'>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
