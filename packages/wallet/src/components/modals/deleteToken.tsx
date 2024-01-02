import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { Token, useWallet } from '../../states/wallet'
import { ModalProps } from '../../types'

interface DeleteTokenProps extends ModalProps {
  token: Token | null
}

export const DeleteToken: React.FC<DeleteTokenProps> = ({ isOpen, onClose, token }) => {
  const { removeToken } = useWallet()

  const handleOnClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleDelete = useCallback(() => {
    if (!token) return
    removeToken({
      chainId: token.chainId,
      address: token.address
    })
    onClose()
  }, [token, onClose])

  if (!token) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Token</ModalHeader>
        <ModalBody>
          <Text>Token address:</Text>
          <Text size='xs'>{token.address}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='brand' mr={3} onClick={handleOnClose} variant='outline'>
            Close
          </Button>
          <Button colorScheme='brand' mr={3} onClick={handleDelete}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
