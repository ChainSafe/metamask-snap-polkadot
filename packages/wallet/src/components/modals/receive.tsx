import { CopyIcon } from '@chakra-ui/icons'
import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack
} from '@chakra-ui/react'
import React from 'react'
import QRCode from 'react-qr-code'
import { useWallet } from '../../hooks/useWallet'
import { useView } from '../../states/view'
import { ModalProps } from '../../types'

interface WalletQRCodeProps {
  address: string
}

export const WalletQRCode: React.FC<WalletQRCodeProps> = ({ address }) => (
  <Center>
    <VStack w='100%'>
      <InputGroup>
        <Input
          size='md'
          defaultValue={address}
          fontSize={12}
          colorScheme='brand'
          border='1px'
          borderColor='brand.500'
          isReadOnly
        />
        <InputRightElement>
          <CopyIcon color='brand.500' />
        </InputRightElement>
      </InputGroup>
      <QRCode style={{ height: 'auto', maxWidth: '100%', width: '100%' }} value={address} viewBox={`0 0 256 256`} />
    </VStack>
  </Center>
)

export const Receive: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { network } = useView()
  const { address } = useWallet(network)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Receive</ModalHeader>
        <ModalBody>{address != null && <WalletQRCode address={address} />}</ModalBody>
        <ModalFooter>
          <Button colorScheme='brand' mr={3} onClick={onClose} variant='outline'>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
