import { ArrowForwardIcon, DeleteIcon, InfoOutlineIcon, LinkIcon, StarIcon } from '@chakra-ui/icons'
import { Button, Grid, GridItem, HStack, StackDivider, Text, Tooltip, VStack, useDisclosure } from '@chakra-ui/react'
import { utils } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useContractReads } from 'wagmi'
import { NOVA_SCAN_URL, erc20ABI, mockTokens } from '../constants'
import { useWallet } from '../hooks/useWallet'
import { useExtension } from '../states/extension'
import { useView } from '../states/view'
import type { Token } from '../states/wallet'
import { useWallet as useWalletStates } from '../states/wallet'
import { DeleteToken } from './modals/deleteToken'
import { MintToken } from './modals/mintToken'
import { TokenDetails } from './modals/tokenDetails'
import { TransferToken } from './modals/transferToken'

interface TokensListProps {
  isMinimized?: boolean
}

export const TokensList: React.FC<TokensListProps> = ({ isMinimized }) => {
  const [isClient, setIsClient] = useState(false)
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const { tokens, editToken } = useWalletStates()
  const { network } = useView()
  const { address } = useWallet(network)
  const { isOpen: isTokenDetailsOpen, onOpen: onTokenDetailsOpen, onClose: onTokenDetailsClose } = useDisclosure()
  const { isOpen: isTokenMintOpen, onOpen: onTokenMintOpen, onClose: onTokenMintClose } = useDisclosure()
  const { isOpen: isTokenTransferOpen, onOpen: onTokenTransferOpen, onClose: onTokenTransferClose } = useDisclosure()
  const { isOpen: isTokenDeleteOpen, onOpen: onTokenDeleteOpen, onClose: onTokenDeleteClose } = useDisclosure()

  const tokensContractCalls = useMemo(
    () =>
      tokens
        .reduce((acc: any[], current) => {
          if (current.address)
            acc.push([
              {
                address: current.address,
                abi: erc20ABI,
                functionName: 'name'
              },
              {
                address: current.address,
                abi: erc20ABI,
                functionName: 'symbol'
              },
              {
                address: current.address,
                abi: erc20ABI,
                functionName: 'decimals'
              },
              {
                address: current.address,
                abi: erc20ABI,
                functionName: 'balanceOf',
                args: [address ?? '']
              }
            ])
          return acc
        }, [])
        .flat(),
    [tokens, address]
  )

  const { data, error, isError, isLoading, refetch } = useContractReads({
    contracts: tokensContractCalls
  })

  const tokensContractCallsAndResults = useMemo(
    () =>
      data
        ? tokensContractCalls.map((t, key) => {
            return {
              ...t,
              ...tokens.find((token) => token.address === t.address),
              ...data[key]
            }
          })
        : tokensContractCalls,
    [tokensContractCalls, data]
  )

  const tokensAndResults = useMemo(() => {
    return tokensContractCallsAndResults
      .filter((t, k) => k % 4 === 0)
      .map((t, k) => {
        return {
          ...t,
          results: {
            name: t.result,
            symbol: tokensContractCallsAndResults[k * 4 + 1].result,
            decimals: tokensContractCallsAndResults[k * 4 + 2].result,
            balance: tokensContractCallsAndResults[k * 4 + 3].result
          }
        }
      })
  }, [tokensContractCallsAndResults])

  const handleImproveTokensData = useCallback(
    () =>
      tokensAndResults.forEach((token) => {
        if (token.results && (!token.name || token.name === '' || !token.symbol || token.symbol === ''))
          editToken({
            chainId: token.chainId,
            address: token.address,
            name: token.results.name,
            symbol: token.results.symbol,
            decimals: token.results.decimals
          } as Token)
      }),
    [tokensAndResults]
  )

  const handleMoreInfo = useCallback((token: Token) => {
    setSelectedToken(token)
    onTokenDetailsOpen()
  }, [])

  const handleExplorerContract = useCallback((token: Token) => {
    if (!token.address) return
    window.open(`${NOVA_SCAN_URL}token/${token.address}`, '_blank')
  }, [])

  const handleMint = useCallback((token: Token) => {
    setSelectedToken(token)
    onTokenMintOpen()
  }, [])

  const handleTransfer = useCallback((token: Token) => {
    setSelectedToken(token)
    onTokenTransferOpen()
  }, [])

  const handleDeleteToken = useCallback((token: Token) => {
    setSelectedToken(token)
    onTokenDeleteOpen()
  }, [])

  const tokensList = useMemo(() => {
    if (isMinimized)
      return tokensAndResults.map((token, key) => {
        const tokenBalance = token.results.balance ? token.results.balance.toString() : '0'
        const tokenBalanceFormatted = parseFloat(utils.formatUnits(tokenBalance, token.decimals)).toFixed(4)
        return (
          <Grid key={key} templateColumns='repeat(3, 1fr)' w='100%' gap={2}>
            <GridItem h='10'>
              <Tooltip label={`${tokenBalance} ${token.symbol}`} placement='top'>
                <Text key={`balance-${key}`} size='lg' colorScheme='brand' fontWeight='600'>
                  {tokenBalanceFormatted}
                </Text>
              </Tooltip>
            </GridItem>
            <GridItem colSpan={2} h='10'>
              <Text key={`symbol-${key}`} size='lg' colorScheme='brand' fontWeight='600'>
                {token.symbol}
              </Text>
            </GridItem>
          </Grid>
        )
      })
    return tokensAndResults.map((token, key) => {
      const tokenBalance = token.results.balance ? token.results.balance.toString() : '0'
      const tokenBalanceFormatted = utils.formatUnits(tokenBalance, token.decimals)
      return (
        <Grid key={key} templateColumns='repeat(6, 1fr)' w='100%' gap={4}>
          <GridItem h='10'>
            <Text key={`symbol-${key}`} size='lg' colorScheme='brand' fontWeight='600'>
              {token.symbol}
            </Text>
          </GridItem>
          <GridItem colSpan={2} h='10'>
            <Text key={`name-${key}`} size='lg' colorScheme='brand' fontWeight='600'>
              {token.name}
            </Text>
          </GridItem>
          <GridItem colSpan={2} h='10'>
            <Tooltip label={`${tokenBalance} ${token.symbol}`} placement='top'>
              <Text key={`balance-${key}`} size='lg' colorScheme='brand' fontWeight='600'>
                {tokenBalanceFormatted}
              </Text>
            </Tooltip>
          </GridItem>
          <GridItem colStart={6} colEnd={6} h='10'>
            {mockTokens.find((t) => t.chainId === token.chainId && t.address === token.address) && (
              <Tooltip label='Mint some Mock Token' placement='top' bg='brand.500'>
                <StarIcon color='brand.500' onClick={() => handleMint(token)} mr={2} />
              </Tooltip>
            )}
            <Tooltip label='More info on this Token' placement='top' bg='brand.500'>
              <InfoOutlineIcon color='brand.500' onClick={() => handleMoreInfo(token)} mr={2} />
            </Tooltip>
            <Tooltip label='Open the token on the Block Explorer' placement='top' bg='brand.500'>
              <LinkIcon color='brand.500' onClick={() => handleExplorerContract(token)} mr={2} />
            </Tooltip>
            <Tooltip label='Transfer some Token' placement='top' bg='brand.500'>
              <ArrowForwardIcon color='brand.500' onClick={() => handleTransfer(token)} mr={2} />
            </Tooltip>
            <Tooltip label='Delete this Token' placement='top' bg='brand.500'>
              <DeleteIcon color='brand.500' onClick={() => handleDeleteToken(token)} />
            </Tooltip>
          </GridItem>
        </Grid>
      )
    })
  }, [tokensAndResults])

  // useEffect(() => {
  //   handleImproveTokensData()
  // }, [tokensAndResults])

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  if (isMinimized)
    return (
      <VStack divider={<StackDivider borderColor='gray.200' />} spacing={4} align='stretch'>
        {tokensList}
      </VStack>
    )

  return (
    <VStack divider={<StackDivider borderColor='gray.200' />} spacing={4} align='stretch'>
      {tokensList}
      <TokenDetails token={selectedToken} isOpen={isTokenDetailsOpen} onClose={onTokenDetailsClose} />
      <MintToken token={selectedToken} isOpen={isTokenMintOpen} onClose={onTokenMintClose} />
      <TransferToken token={selectedToken} isOpen={isTokenTransferOpen} onClose={onTokenTransferClose} />
      <DeleteToken token={selectedToken} isOpen={isTokenDeleteOpen} onClose={onTokenDeleteClose} />
    </VStack>
  )
}
