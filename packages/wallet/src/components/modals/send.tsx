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
  useToast
} from '@chakra-ui/react'
import { BigNumber, utils } from 'ethers'
import React, { useCallback, useState } from 'react'
import { useSend } from '../../hooks/useSend'
import { useWallet } from '../../hooks/useWallet'
import { useView } from '../../states/view'
import { ModalProps } from '../../types'
import { AmountsButton } from '../buttons/amountsButton'

interface Transaction {
  to: string
  amount: BigNumber
  amountHuman: string
}

const initialTransaction: Transaction = {
  to: '',
  amount: BigNumber.from(0),
  amountHuman: ''
}

export const Send: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast()
  const [transaction, setTransaction] = useState<Transaction>(initialTransaction)
  const { handleSend: handleSendNext } = useSend()
  const { network } = useView()
  const { address } = useWallet(network)

  const handleUpdateTransaction = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.id === 'to')
        setTransaction((transaction) => ({
          ...transaction,
          [e.target.id]: e.target.value
        }))
      else {
        const amountHuman = e.target.value
        const amount = utils.parseUnits(amountHuman, 18)
        setTransaction((transaction) => ({
          ...transaction,
          amount,
          amountHuman
        }))
      }
    },
    [setTransaction]
  )

  const handleSetToYourAddress = useCallback(() => {
    if (!address)
      return toast({
        title: 'Error',
        description: 'Address not found',
        status: 'error',
        duration: 9000,
        isClosable: true
      })
    setTransaction((transaction) => ({
      ...transaction,
      to: address
    }))
  }, [address, toast, setTransaction])

  const handleSetAmount = useCallback(
    (amountHuman: string) => {
      const amount = utils.parseUnits(amountHuman, 18)
      setTransaction((transaction) => ({
        ...transaction,
        amount,
        amountHuman
      }))
    },
    [setTransaction]
  )

  const handleSend = useCallback(async () => {
    if (!transaction.to || !transaction.amount)
      return toast({
        title: 'Error',
        description: 'Please enter a valid address and amount',
        status: 'error',
        duration: 9000,
        isClosable: true
      })
    await handleSendNext(network, transaction.to, transaction.amount)
    onClose()
  }, [transaction, handleSendNext, toast, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Send</ModalHeader>
        <ModalBody>
          <FormControl mt='2'>
            <FormLabel>To</FormLabel>
            <InputGroup>
              <Input
                id='to'
                placeholder='To'
                defaultValue={transaction.to}
                value={transaction.to}
                onChange={handleUpdateTransaction}
              />
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
              <Input
                placeholder='amount'
                defaultValue={transaction.amountHuman}
                value={transaction.amountHuman}
                onChange={handleUpdateTransaction}
              />
              <InputRightAddon>
                <AmountsButton handleSetAmount={handleSetAmount} />
              </InputRightAddon>
            </InputGroup>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='brand' mr={3} onClick={onClose} variant='outline'>
            Cancel
          </Button>
          <Button colorScheme='brand' mr={3} onClick={handleSend}>
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
