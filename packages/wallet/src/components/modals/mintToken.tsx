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
import { useView } from '../../states/view'
import type { Token } from '../../states/wallet'
import { ModalProps } from '../../types'
import { AmountsButton } from '../buttons/amountsButton'

interface Transaction {
  amount: BigNumber
  amountHuman: string
}

interface SendTokenProps extends ModalProps {
  token: Token | null
}

const initialTransaction: Transaction = {
  amount: BigNumber.from(0),
  amountHuman: ''
}

export const MintToken: React.FC<SendTokenProps> = ({ isOpen, onClose, token }) => {
  const [transaction, setTransaction] = useState<Transaction>(initialTransaction)
  const { isValid, isContractEvmLoading, handleMintTokenEvm } = useSend()

  const handleUpdateTransaction = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setTransaction((transaction) => ({
        ...transaction,
        [e.target.id]: e.target.value
      })),
    [setTransaction]
  )

  const handleSetAmount = useCallback(
    (amountHuman: string) => {
      if (!token) return
      const amount = utils.parseUnits(amountHuman, token.decimals)
      setTransaction((transaction) => ({
        ...transaction,
        amount,
        amountHuman
      }))
    },
    [token, setTransaction]
  )

  const handleSend = useCallback(async () => {
    if (!token) return
    await handleMintTokenEvm(token, transaction.amount)
    onClose()
  }, [token, transaction, handleMintTokenEvm, onClose])

  const handleOnClose = useCallback(() => {
    setTransaction(initialTransaction)
    onClose()
  }, [onClose])

  if (!token) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Mint Mock Token</ModalHeader>
        <ModalBody>
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
            Mint
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
