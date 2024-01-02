import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast
} from '@chakra-ui/react'
import { AsyncCreatableSelect, OptionBase, Select, SingleValue } from 'chakra-react-select'
import React, { useCallback, useMemo, useState } from 'react'
import { supportedTokens } from '../../constants'
import { Token, initialToken, useWallet } from '../../states/wallet'
import { ModalProps } from '../../types'

export interface Option<T> extends OptionBase {
  label: string
  value: T
}

export const AddToken: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { addToken, isTokenInList } = useWallet()
  const toast = useToast()
  const [token, setToken] = useState<Token>(initialToken)
  const [fieldsErrors, setFieldsErrors] = useState<{ [key: string]: string }>({})

  const handleUpdateToken = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.id === 'address' && isTokenInList({ chainId: token.chainId, address: e.target.value }))
        setFieldsErrors((errors) => ({
          ...errors,
          [e.target.id]: 'Token already in list'
        }))
      else setFieldsErrors((errors) => ({ ...errors, [e.target.id]: '' }))
      setToken((token) => ({
        ...token,
        [e.target.id]: e.target.value
      }))
    },
    [setToken, setFieldsErrors, isTokenInList]
  )

  const handleSave = useCallback(() => {
    if (token.address === '')
      return setFieldsErrors((errors) => ({
        ...errors,
        address: 'Address is required'
      }))
    if (isTokenInList({ chainId: token.chainId, address: token.address })) {
      return toast({
        title: 'Token already in list',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    }
    addToken(token)
    onClose()
  }, [token, addToken, toast, onClose])

  const tokenAddressesOptions = useMemo(
    () =>
      supportedTokens.map((token) => ({
        label: token.address,
        value: token.address
      })),
    [supportedTokens]
  )

  const handleUpdateTokenAddresses = useCallback(
    (tokenAddresses: SingleValue<Option<string>>) => {
      const address = tokenAddresses != null ? tokenAddresses.value : ''
      if (isTokenInList({ chainId: token.chainId, address }))
        setFieldsErrors((errors) => ({
          ...errors,
          address: 'Token already in list'
        }))
      else setFieldsErrors((errors) => ({ ...errors, address: '' }))
      setToken((token) => ({
        ...token,
        address
      }))
    },
    [token, isTokenInList, setToken, setFieldsErrors]
  )

  const handleOnClose = useCallback(() => {
    setToken(initialToken)
    setFieldsErrors({})
    onClose()
  }, [onClose])
  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add token</ModalHeader>
        <ModalBody>
          <FormControl mt='2'>
            <FormLabel>Token address</FormLabel>
            <Box mt='6'>
              <AsyncCreatableSelect
                name='address'
                placeholder='Token address'
                value={{
                  label: token.address,
                  value: token.address
                }}
                onChange={handleUpdateTokenAddresses}
                options={tokenAddressesOptions}
              />
            </Box>
            {!fieldsErrors.address ? (
              <FormHelperText>Enter the contract address of the token.</FormHelperText>
            ) : (
              <FormHelperText color='red.500'>{fieldsErrors.address}</FormHelperText>
            )}
          </FormControl>

          <FormControl id='name' mt='8' onChange={handleUpdateToken}>
            <FormLabel>Token name</FormLabel>
            <Input placeholder='Token name' />
            {!fieldsErrors.name ? (
              <FormHelperText>Enter the name of the token. (Optional)</FormHelperText>
            ) : (
              <FormHelperText color='red.500'>{fieldsErrors.name && fieldsErrors.name}</FormHelperText>
            )}
          </FormControl>
          <FormControl id='symbol' mt='2' onChange={handleUpdateToken}>
            <FormLabel>Token symbol</FormLabel>
            <Input placeholder='Token symbol' />
            {!fieldsErrors.symbol ? (
              <FormHelperText>Enter the symbol of the token. (Optional)</FormHelperText>
            ) : (
              <FormHelperText color='red.500'>{fieldsErrors.symbol && fieldsErrors.symbol}</FormHelperText>
            )}
          </FormControl>
          <FormControl id='decimals' mt='2' onChange={handleUpdateToken}>
            <FormLabel>Token decimals</FormLabel>
            <Input placeholder='Token decimals' />
            {!fieldsErrors.decimals ? (
              <FormHelperText>Enter the decimals of the token. (Optional)</FormHelperText>
            ) : (
              <FormHelperText color='red.500'>{fieldsErrors.decimals && fieldsErrors.decimals}</FormHelperText>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='brand' mr={3} onClick={handleOnClose} variant='outline'>
            Cancel
          </Button>
          <Button colorScheme='brand' mr={3} onClick={handleSave}>
            Add token
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
