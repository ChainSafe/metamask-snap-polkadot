import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react'
import { BigNumber, utils } from 'ethers'
import React, { useCallback, useState } from 'react'
import { useSend } from '../../hooks/useSend'
import { useWallet } from '../../hooks/useWallet'
import { useView } from '../../states/view'
import type { Token } from '../../states/wallet'
import { ModalProps } from '../../types'
import { AmountsButton } from '../buttons/amountsButton'

interface Transaction {
  to: string
  amount: BigNumber
  amountHuman: string
}

interface SendTokenProps extends ModalProps {
  token: Token | null
}

const initialTransaction: Transaction = {
  to: '',
  amount: BigNumber.from(0),
  amountHuman: ''
}

export const TransferToken: React.FC<SendTokenProps> = ({ isOpen, onClose, token }) => {
  const [transaction, setTransaction] = useState<Transaction>(initialTransaction)
  const { isValid, isContractEvmLoading, handleTransferTokenEvm } = useSend()
  const { network } = useView()
  const { address } = useWallet(network)

  const handleUpdateTransaction = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        setTransaction((transaction) => ({
          ...transaction,
          [e.target.id]: e.target.value
        }))
      } catch (e) {
        console.error('handleUpdateTransaction-error', e)
      }
    },
    [setTransaction]
  )

  const handleSetToYourAddress = useCallback(() => {
    try {
      if (!address) throw new Error('Address not found')
      setTransaction((transaction) => ({
        ...transaction,
        to: address
      }))
    } catch (e) {
      console.error('handleSetToYourAddress-error', e)
    }
  }, [address, setTransaction])

  const handleSetAmount = useCallback(
    (amountHuman: string) => {
      try {
        if (!token) throw new Error('Token not found')
        const amount = utils.parseUnits(amountHuman, token.decimals)
        setTransaction((transaction) => ({
          ...transaction,
          amount,
          amountHuman
        }))
      } catch (e) {
        console.error('handleSetAmount-error', e)
      }
    },
    [token, setTransaction]
  )

  const handleSend = useCallback(async () => {
    try {
      if (!token) throw new Error('Token not found')
      await handleTransferTokenEvm(token, transaction.to, transaction.amount)
      onClose()
    } catch (e) {
      console.error('handleSend-error', e)
    }
  }, [token, transaction, handleTransferTokenEvm, onClose])

  const handleOnClose = useCallback(() => {
    setTransaction(initialTransaction)
    onClose()
  }, [onClose, setTransaction])

  if (!token) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Send Token</ModalHeader>
        <ModalBody>
          <Text>Token address:</Text>
          <Text size='xs'>{token.address}</Text>

          <FormControl id='to' mt='2'>
            <FormLabel>To</FormLabel>
            <InputGroup>
              <Input placeholder='To' value={transaction.to} onChange={handleUpdateTransaction} />
              <InputRightAddon>
                <Button size='xs' variant='outline' colorScheme='brand' mt={2} onClick={handleSetToYourAddress}>
                  Your Address
                </Button>
              </InputRightAddon>
            </InputGroup>
            {/* To-Do: add "max" button inside input field */}
            {/* To-Do: add current balance inside input field */}
          </FormControl>
          <FormControl id='amount' mt='2'>
            <FormLabel>Amount</FormLabel>
            <InputGroup>
              <Input placeholder='amount' value={transaction.amountHuman} onChange={handleUpdateTransaction} />
              <InputRightAddon>
                <AmountsButton handleSetAmount={handleSetAmount} />
              </InputRightAddon>
            </InputGroup>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='brand' mr={3} onClick={handleOnClose} variant='outline'>
            Close
          </Button>
          <Button
            colorScheme='brand'
            mr={3}
            onClick={handleSend}
            isDisabled={!isValid}
            isLoading={isContractEvmLoading}>
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
