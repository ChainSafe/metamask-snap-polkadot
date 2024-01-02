import { useToast } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { useCallback, useMemo, useState } from 'react'
import {
  useAccount,
  useBlockNumber,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSendTransaction
} from 'wagmi'
import { SuccessTxToast } from '../components/toasts'
import { ERROR_WALLET_NOT_FOUND, toastConfig } from '../constants'
import { erc20ABI } from '../constants/abis'
import { useExtension, useTransactions } from '../states/extension'
import { useView } from '../states/view'
import { Network, Token } from '../types'
import { toHex, valueToHex } from '../utils'

export const defaultSnapId = 'local:http://localhost:8081'

export const useSend = () => {
  const snapId = process.env.REACT_APP_SNAP_ID ? process.env.REACT_APP_SNAP_ID : defaultSnapId
  const toast = useToast()
  const { api, mmApi, extension, subspaceAccount, injectedExtension } = useExtension()
  const { addTransactionToWatch } = useTransactions()
  const { network } = useView()
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { sendTransactionAsync } = useSendTransaction()
  const { data: blockNumber } = useBlockNumber()

  const [token, setToken] = useState<Token | null>(null)
  const [to, setTo] = useState<string>('')
  const [amount, setAmount] = useState<BigNumber>(BigNumber.from(0))
  const [functionName, setFunctionName] = useState<string>('')

  const { config, error } = usePrepareContractWrite({
    chainId: token ? token.chainId : 0,
    address: token ? (token.address as `0x${string}`) : ('0x0' as `0x${string}`),
    abi: erc20ABI,
    functionName,
    args: [to, amount.toString()]
  })
  const { data, isLoading, isSuccess, isError, write, writeAsync, reset, status } = useContractWrite({
    ...config
  })
  const isValid = useMemo(() => error === null, [error])
  const isContractEvmLoading = useMemo(() => isLoading, [isLoading])

  const handleSendConsensus = useCallback(
    async (to: string, amount: BigNumber) => {
      console.log('handleSendConsensus')
      console.log('extension.data?.defaultAccount', extension.data?.defaultAccount)
      console.log('to', to)
      console.log('amount', amount)
      if (!to || !amount) return toast({ ...toastConfig, status: 'error', title: 'Error', description: 'Invalid data' })
      if (!api || !extension.data || !injectedExtension || !subspaceAccount)
        return toast({
          ...ERROR_WALLET_NOT_FOUND,
          ...toastConfig,
          status: 'error'
        })
      if (extension.data) {
        console.log('extension.data', extension.data)
        console.log('extension.data.defaultAccount', extension.data.defaultAccount)
        const block = await api.rpc.chain.getBlock()
        console.log('block', block)
        if (extension.data.defaultAccount.meta.source === 'metamask') {
          try {
            console.log('mmApi', mmApi)
            if (!mmApi) return

            const txPayload = await mmApi.generateTransactionPayload(toHex(amount.toString()), to)
            console.log('txPayload', txPayload)
            const test2 = await window.ethereum.request({
              method: 'wallet_invokeSnap',
              params: {
                request: { method: 'generateTransactionPayload', params: { amount: toHex(amount.toString()), to } },
                snapId
              }
            })
            console.log('test2', test2)
            const signedTx = await mmApi.signPayloadJSON(txPayload.payload)
            console.log('signedTx', signedTx)
            const tx = await mmApi.send(signedTx, txPayload)
            console.log('tx', tx)

            // const signedBlock = await api.rpc.chain.getBlock(tx.block)

            addTransactionToWatch('consensus', {
              chainId: 0,
              extrinsicHash: tx.hash.toString(),
              method: '',
              sender: tx.sender.toString(),
              value: amount.toString(),
              fromBlockNumber: block.block.header.number.toNumber(),
              fromBlockHash: block.block.header.hash.toString(),
              parameters: []
            })
          } catch (error) {
            console.log('error', error)
            toast({
              ...toastConfig,
              status: 'error',
              title: 'Error',
              description: 'Something went wrong'
            })
          }
        } else {
          console.log('amount-hex', toHex(amount.toString()))
          try {
            const transfer = api.tx.balances.transferAllowDeath(to, toHex(amount.toString()))
            console.log('transfer', transfer)

            const hash = await transfer.signAndSend(extension.data?.defaultAccount.address, {
              signer: injectedExtension.signer
            })
            console.log('hash', hash)

            addTransactionToWatch('consensus', {
              chainId: 0,
              extrinsicHash: hash.toString(),
              method: '',
              sender: subspaceAccount,
              value: amount.toString(),
              fromBlockNumber: block.block.header.number.toNumber(),
              fromBlockHash: block.block.header.hash.toString(),
              parameters: []
            })

            // toast({
            //   ...toastConfig,
            //   isClosable: true
            //   // render: () => (
            //   //   <SuccessTxToast
            //   //     heading='Transaction sent'
            //   //     description='Your transaction was sent. The transaction need to be minted then, you will see the change after the next epoch.'
            //   //     hash={hash.toString()}
            //   //   />
            //   // )
            // })
            // .transferAllowDeath(to, amount)
            // .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer })
            console.log('transfer', transfer)
            return hash
          } catch (error) {
            console.error('error-handleSendConsensus', error)
            toast({
              ...toastConfig,
              status: 'error',
              title: 'Error',
              description: 'Something went wrong'
            })
          }
        }
      }
      return
    },
    [addTransactionToWatch, api, extension.data, injectedExtension, subspaceAccount, toast]
  )

  const handleSendEvm = useCallback(
    async (to: string, amount: BigNumber) => {
      if (!address || !blockNumber || !chain) return
      try {
        const transaction = await sendTransactionAsync({
          to,
          value: BigInt(amount.toString())
        })
        if (transaction) {
          addTransactionToWatch('evm', {
            chainId: chain.id,
            extrinsicHash: transaction.hash.toString(),
            method: '',
            sender: address,
            value: amount.toString(),
            fromBlockNumber: Number(blockNumber) || 0,
            fromBlockHash: '0x0',
            parameters: []
          })
          toast({
            ...toastConfig,
            status: 'info',
            title: 'Transaction sent',
            description: 'Your transaction was sent. The transaction need to be mined now.'
          })
        }
      } catch (error) {
        console.error('error-handleSendEvm', error)
        toast({
          ...toastConfig,
          status: 'error',
          title: 'Error',
          description: 'Something went wrong'
        })
      }
    },
    [addTransactionToWatch, api, extension.data, injectedExtension, subspaceAccount, toast]
  )

  const handleMintTokenEvm = useCallback(
    async (token: Token, amount: BigNumber) => {
      if (!address || !blockNumber) return
      try {
        setToken(token)
        setFunctionName('mint')
        setTo(address)
        setAmount(amount)

        if (writeAsync) {
          const data = await writeAsync()
          if (data) {
            addTransactionToWatch('evm', {
              chainId: token.chainId,
              extrinsicHash: data.hash.toString(),
              method: functionName,
              sender: address,
              value: '0',
              fromBlockNumber: Number(blockNumber) || 0,
              fromBlockHash: '0x0',
              parameters: [address, amount.toString()]
            })
            toast({
              ...toastConfig,
              status: 'info',
              title: 'Transaction sent',
              description: 'Your transaction was sent. The transaction need to be mined now.'
            })
          }
        }
      } catch (error) {
        console.error('error-handleMintTokenEvm', error)
        toast({
          ...toastConfig,
          status: 'error',
          title: 'Error',
          description: 'Something went wrong'
        })
      }
    },
    [address, addTransactionToWatch, api, extension.data, injectedExtension, subspaceAccount, toast]
  )

  const handleTransferTokenEvm = useCallback(
    async (token: Token, to: string, amount: BigNumber) => {
      if (!address || !blockNumber) return
      try {
        setToken(token)
        setFunctionName('transfer')
        setTo(to)
        setAmount(amount)

        if (writeAsync) {
          const data = await writeAsync()
          if (data) {
            addTransactionToWatch('evm', {
              chainId: token.chainId,
              extrinsicHash: data.hash.toString(),
              method: functionName,
              sender: address,
              value: '0',
              fromBlockNumber: Number(blockNumber) || 0,
              fromBlockHash: '0x0',
              parameters: [to, amount.toString()]
            })
            toast({
              ...toastConfig,
              status: 'info',
              title: 'Transaction sent',
              description: 'Your transaction was sent. The transaction need to be mined now.'
            })
          }
        }
      } catch (error) {
        console.error('error-handleTransferTokenEvm', error)
        toast({
          ...toastConfig,
          status: 'error',
          title: 'Error',
          description: 'Something went wrong'
        })
      }
    },
    [addTransactionToWatch, api, extension.data, injectedExtension, subspaceAccount, toast]
  )

  const handleSend = useCallback(
    async (network: Network, to: string, amount: BigNumber) => {
      switch (network) {
        case 'consensus':
          return await handleSendConsensus(to, amount)
        case 'evm':
          return await handleSendEvm(to, amount)
        default:
          return
      }
    },
    [handleSendConsensus, handleSendEvm]
  )

  return {
    isValid,
    isContractEvmLoading,
    handleSendConsensus,
    handleSendEvm,
    handleMintTokenEvm,
    handleTransferTokenEvm,
    handleSend
  }
}
