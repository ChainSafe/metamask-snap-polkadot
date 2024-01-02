import { CheckCircleIcon, CopyIcon, DeleteIcon, LinkIcon, RepeatIcon, WarningIcon } from '@chakra-ui/icons'
import {
  HStack,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useMediaQuery,
  useToast
} from '@chakra-ui/react'
import { utils } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTransaction, useWaitForTransaction } from 'wagmi'
import { NOVA_SCAN_URL, SUBSCAN_URL, TransactionStatus } from '../constants'
import { useExtension, useTransactions } from '../states/extension'
import { useView } from '../states/view'
import type { Transaction } from '../types'
import { capitalizeFirstLetter, formatAddress } from '../utils'

interface TransactionsListProps {
  address?: string | null
}

interface TransactionRowProps {
  transaction: Transaction
  isDesktopView: boolean
}

const MAX_BLOCKS_TO_FETCH_FOR_TRANSACTIONS_SPOTTER = 50

export const ConsensusTransactionRow: React.FC<TransactionRowProps> = ({ transaction, isDesktopView }) => {
  const toast = useToast()
  const { changeTransactionStatus, bumpLastBlockVerified, removeTransaction } = useTransactions()
  const { api } = useExtension()
  const dateFormatted = transaction.onTimestamp ? new Date(transaction.onTimestamp).toLocaleString() : '-'

  const handleTransactionsSuccess = useCallback(async () => {
    if (!api || !transaction) return

    const verifyNextBlocks = async (blockNumber: number) => {
      try {
        const header = await api.rpc.chain.getBlockHash(blockNumber)
        const signedBlock = await api.rpc.chain.getBlock(header)

        signedBlock.block.extrinsics.forEach((ex) => {
          const block = ex.toHuman() as { isSigned: boolean }

          if (block.isSigned && ex.hash.toHex() === transaction.extrinsicHash)
            changeTransactionStatus(transaction.extrinsicHash, TransactionStatus.Success)
        })
        bumpLastBlockVerified(transaction.extrinsicHash, blockNumber)
      } catch (error) {
        console.error('error-verifyNextBlocks', error)
        throw error
      }
    }
    let startFromBlock = transaction.fromBlockNumber
    if (startFromBlock === 0 && transaction.fromBlockHash) {
      try {
        // const header = await api.rpc.chain.getBlockHash(transaction.fromBlockHash)
        // console.log('header', header)
        const signedBlock = await api.rpc.chain.getBlock(transaction.fromBlockHash)
        startFromBlock = signedBlock.block.header.number.toNumber()
      } catch (error) {
        console.error('error-getBlock', error)
      }
    }
    if (startFromBlock === 0 && transaction.lastBlockNumber) {
      try {
        if (transaction.lastBlockNumber > 0) startFromBlock = transaction.lastBlockNumber
      } catch (error) {
        console.error('error-getBlock', error)
      }
    }
    for (let i = startFromBlock; i < startFromBlock + MAX_BLOCKS_TO_FETCH_FOR_TRANSACTIONS_SPOTTER; i++) {
      try {
        verifyNextBlocks(i)
      } catch (error) {
        console.error('error-verifyNextBlocks', error)
      }
    }
  }, [api, changeTransactionStatus, transaction])

  const transactionStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color='green.500' />
      case 'failed':
        return <WarningIcon color='red.500' />
      case 'pending':
      default:
        return (
          <Tooltip label={`Last block verified ${transaction.lastBlockNumber ?? transaction.fromBlockNumber}`}>
            <Spinner size='sm' color='brand.500' />
          </Tooltip>
        )
    }
  }, [])

  const handleDeleteTransaction = useCallback(
    (transaction: Transaction) => {
      removeTransaction(transaction.extrinsicHash)
    },
    [changeTransactionStatus]
  )

  useEffect(() => {
    if (transaction.status === 'pending') handleTransactionsSuccess()
  }, [transaction.status])

  return (
    <Tr>
      <Td>
        <Text
          size={isDesktopView ? 'md' : 'sm'}
          fontSize={isDesktopView ? 16 : 12}
          fontWeight={isDesktopView ? 700 : 500}>
          {dateFormatted}
        </Text>
      </Td>
      <Td>
        <HStack>
          {transactionStatusIcon(transaction.status)}{' '}
          <Text size={isDesktopView ? 'md' : 'sm'}>{capitalizeFirstLetter(transaction.status)}</Text>
        </HStack>
      </Td>
      <Td>
        <Text size={isDesktopView ? 'md' : 'sm'}>{utils.formatUnits(transaction.value, 18)} tSSC</Text>
      </Td>
      {isDesktopView && (
        <Td color='brand.500' cursor={'pointer'}>
          <Tooltip label={`Copy extrinsic`} aria-label={`Copy extrinsic`}>
            <CopyIcon
              ml='2'
              mb='1'
              onClick={() =>
                navigator.clipboard.writeText(transaction.extrinsicHash).then(() => {
                  toast({
                    title: 'Extrinsic copied',
                    status: 'success',
                    duration: 2000,
                    isClosable: true
                  })
                })
              }
            />
          </Tooltip>
          <Tooltip label={`View in explorer`} aria-label={`View in explorer`}>
            <LinkIcon
              ml='2'
              mb='1'
              onClick={() =>
                window.open(
                  transaction.network === 'consensus'
                    ? `${SUBSCAN_URL}extrinsic/${transaction.extrinsicHash}`
                    : `${NOVA_SCAN_URL}tx/${transaction.extrinsicHash}`,
                  '_blank'
                )
              }
            />
          </Tooltip>
          <DeleteIcon color='brand.500' onClick={() => handleDeleteTransaction(transaction)} ml={2} />
        </Td>
      )}
    </Tr>
  )
}

export const EVMTransactionRow: React.FC<TransactionRowProps> = ({ transaction, isDesktopView }) => {
  const toast = useToast()
  const { changeTransactionStatus } = useTransactions()
  const dateFormatted = transaction.onTimestamp ? new Date(transaction.onTimestamp).toLocaleString() : '-'

  const { data: dataTx } = useTransaction({
    chainId: transaction.chainId,
    hash: transaction.extrinsicHash as `0x${string}`
  })
  const { data, error, isError, isLoading, refetch } = useWaitForTransaction({
    chainId: transaction.chainId,
    hash: transaction.extrinsicHash as `0x${string}`
  })

  const transactionStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color='green.500' />
      case 'failed':
        return <WarningIcon color='red.500' />
      case 'pending':
      default:
        return <Spinner size='sm' color='brand.500' />
    }
  }, [])

  const handleTransactionsSuccess = useCallback(() => {
    if (data) {
      const { status, transactionHash } = data
      if (status === 'success') return changeTransactionStatus(transactionHash, TransactionStatus.Success)
      return changeTransactionStatus(transactionHash, TransactionStatus.Failed)
    }
  }, [data])

  const handleDeleteTransaction = useCallback(
    (transaction: Transaction) => {
      // changeTransactionStatus(transaction.extrinsicHash, TransactionStatus.Deleted)
    },
    [changeTransactionStatus]
  )

  useEffect(() => {
    if (transaction.status === 'pending') refetch()
  }, [transaction.status])

  useEffect(() => {
    if (data) handleTransactionsSuccess()
  }, [data])

  return (
    <Tr>
      <Td>
        <Text
          size={isDesktopView ? 'md' : 'sm'}
          fontSize={isDesktopView ? 16 : 12}
          fontWeight={isDesktopView ? 700 : 500}>
          {dateFormatted}
        </Text>
      </Td>
      <Td>
        <HStack>
          {transactionStatusIcon(transaction.status)}{' '}
          <Text size={isDesktopView ? 'md' : 'sm'}>{capitalizeFirstLetter(transaction.status)}</Text>
        </HStack>
      </Td>
      <Td>
        {transaction.value !== '0' && (
          <Text size={isDesktopView ? 'md' : 'sm'}>{utils.formatUnits(transaction.value, 18)} tSSC</Text>
        )}
        {transaction.method && (
          <Tag size='sm' colorScheme='brand' variant='outline' ml='2'>
            <Tooltip
              label={
                transaction.parameters
                  ? `${transaction.method}(${transaction.parameters.join(',')})`
                  : transaction.method
              }
              aria-label={
                transaction.parameters
                  ? `${transaction.method}(${transaction.parameters.join(',')})`
                  : transaction.method
              }>
              {transaction.method}
            </Tooltip>
          </Tag>
        )}
      </Td>
      {isDesktopView && (
        <Td color='brand.500' cursor={'pointer'}>
          <HStack>
            <Tooltip label={`Copy transaction hash`} aria-label={`Copy transaction hash`}>
              <CopyIcon
                ml='2'
                mb='1'
                onClick={() =>
                  navigator.clipboard.writeText(transaction.extrinsicHash).then(() => {
                    toast({
                      title: 'Extrinsic copied',
                      status: 'success',
                      duration: 2000,
                      isClosable: true
                    })
                  })
                }
              />
            </Tooltip>
            <Text size={isDesktopView ? 'md' : 'sm'}>{formatAddress(transaction.extrinsicHash)}</Text>
            <Tooltip label={`View in explorer`} aria-label={`View in explorer`}>
              <LinkIcon
                ml='2'
                mb='1'
                onClick={() =>
                  window.open(
                    transaction.network === 'consensus'
                      ? `${SUBSCAN_URL}extrinsic/${transaction.extrinsicHash}`
                      : `${NOVA_SCAN_URL}tx/${transaction.extrinsicHash}`,
                    '_blank'
                  )
                }
              />
            </Tooltip>
            <DeleteIcon color='brand.500' onClick={() => handleDeleteTransaction(transaction)} ml={2} />
          </HStack>
        </Td>
      )}
    </Tr>
  )
}

export const TransactionRow: React.FC<TransactionRowProps> = ({ transaction, isDesktopView }) => {
  return transaction.network === 'consensus' ? (
    <ConsensusTransactionRow transaction={transaction} isDesktopView={isDesktopView} />
  ) : (
    <EVMTransactionRow transaction={transaction} isDesktopView={isDesktopView} />
  )
}

export const TransactionsList: React.FC<TransactionsListProps> = ({ address }) => {
  const [clientSide, setClientSide] = useState(false)
  const { network } = useView()
  // const { address } = useWallet(network)
  const { transactions } = useTransactions()
  const [isDesktopView] = useMediaQuery('(min-width: 800px)', { ssr: true, fallback: false })

  const networkTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.network === network && transaction.sender === address),
    [transactions, network, address]
  )

  const transactionsList = useMemo(() => {
    if (networkTransactions && networkTransactions.length > 0)
      return networkTransactions
        .reverse()
        .map((transaction, key) => <TransactionRow key={key} transaction={transaction} isDesktopView={isDesktopView} />)
    return (
      <Tr>
        <Td colSpan={4}>No transactions</Td>
      </Tr>
    )
  }, [networkTransactions])

  const handleReRender = useCallback(() => {
    setClientSide(false)
    setClientSide(true)
  }, [])

  useEffect(() => {
    setClientSide(true)
  }, [])

  if (!clientSide) return null

  return (
    <TableContainer>
      <Heading size='md' color='gray.500' fontWeight='600' mt={[6, 4, 2]} ml={[6, 4, 2]}>
        {capitalizeFirstLetter(network)} Transaction
      </Heading>
      <Table variant='striped' colorScheme='brand'>
        <Thead>
          <Tr>
            <Th>Sent On</Th>
            <Th>Status</Th>
            <Th>Value</Th>
            <Th>
              Actions <RepeatIcon color='brand.500' onClick={handleReRender} cursor='pointer' />
            </Th>
          </Tr>
        </Thead>
        <Tbody>{transactionsList}</Tbody>
      </Table>
    </TableContainer>
  )
}
