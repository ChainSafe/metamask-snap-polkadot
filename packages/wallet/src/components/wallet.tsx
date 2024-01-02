import { AddIcon, InfoIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Card,
  Center,
  Grid,
  GridItem,
  HStack,
  Heading,
  Spacer,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
  useMediaQuery
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from '../hooks/useWallet'
import { useExtension } from '../states/extension'
import { useView } from '../states/view'
import { formatNumber, hexToNumber } from '../utils'
import { AmountActionAndTransactions } from './amountActionAndTransactions'
import { SubspaceIcon, TokenBalanceIcon, TokenStakedIcon } from './icons'
import { AddToken } from './modals/addToken'
import { TokensList } from './tokensList'

export const Wallet: React.FC = () => {
  const { network, setNetwork } = useView()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [tabsIndex, setTabsIndex] = useState(0)
  const { walletBalanceFormatted, walletLabel } = useWallet(network)
  const { isOpen: isReceiveOpen, onOpen: onReceiveOpen, onClose: onReceiveClose } = useDisclosure()
  const { isOpen: isSendOpen, onOpen: onSendOpen, onClose: onSendClose } = useDisclosure()
  const { isOpen: isAddTokenOpen, onOpen: onAddTokenOpen, onClose: onAddTokenClose } = useDisclosure()
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)', { ssr: true, fallback: false })

  const { subspaceAccount, stakingConstants, chainDetails } = useExtension()
  const { tokenDecimals, tokenSymbol } = chainDetails

  const handleTabChange = useCallback((index: number) => {
    switch (index) {
      case 0:
        setNetwork('consensus')
        router.push('/wallet/consensus')
        break
      case 1:
        setNetwork('evm')
        router.push('/wallet/evm')
        break
      default:
        break
    }
    setTabsIndex(index)
  }, [])

  const walletBalanceStaked = useMemo(
    () =>
      stakingConstants.nominators
        .filter((nominator) => nominator.nominatorOwner === subspaceAccount)
        .reduce((acc, nominator) => acc + hexToNumber(nominator.shares, tokenDecimals), 0) || 0,
    [stakingConstants.nominators, subspaceAccount, tokenDecimals]
  )

  const Row = useCallback(
    (label: string, symbol: string, balance?: string, icon?: React.JSX.Element) => {
      return (
        <Box key='walletBalance'>
          <Grid templateColumns='repeat(3, 1fr)' w='100%' gap={2}>
            <GridItem h='10'>
              {balance && (
                <Tooltip label={label} aria-label={label}>
                  <Text size='lg' colorScheme='brand' fontWeight='600'>
                    {balance}
                  </Text>
                </Tooltip>
              )}
            </GridItem>
            <GridItem h='10'>
              <Tooltip label={label} aria-label={label}>
                <Text size='lg' colorScheme='brand' fontWeight='600'>
                  {symbol}
                </Text>
              </Tooltip>
            </GridItem>
            {icon && (
              <GridItem h='10'>
                <Tooltip label={label} aria-label={label}>
                  {icon && icon}
                </Tooltip>
              </GridItem>
            )}
          </Grid>
        </Box>
      )
    },
    [walletBalanceFormatted]
  )

  const WalletBalance = useMemo(
    () =>
      Row(
        'Amount available in wallet',
        tokenSymbol ?? 'tSSC',
        walletBalanceFormatted,
        <TokenBalanceIcon width='32px' height='32px' />
      ),
    [network, tokenSymbol, walletBalanceFormatted]
  )

  const WalletBalanceStaked = useMemo(() => {
    if (network === 'consensus' && walletBalanceStaked > 0 && isClient)
      return Row(
        'Amount staked as operator or nominator',
        tokenSymbol ?? 'tSSC',
        formatNumber(walletBalanceStaked, 2),
        <TokenStakedIcon width='32px' height='32px' />
      )
  }, [network, tokenSymbol, walletBalanceStaked, isClient])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (router.query.walletType === 'consensus') {
      setTabsIndex(0)
      setNetwork('consensus')
    } else if (router.query.walletType === 'evm') {
      setTabsIndex(1)
      setNetwork('evm')
    }
  }, [router.query.walletType])

  if (!isClient) return null

  if (isLargerThan800)
    return (
      <Card h='60vh'>
        <Grid h='90%' templateRows='repeat(2, 1fr)' templateColumns='repeat(5, 1fr)' gap={4}>
          <GridItem rowSpan={2} colSpan={1}>
            <VStack divider={<StackDivider borderColor='gray.200' />} spacing={4} align='stretch' m='2'>
              <Box key='accountTitle'>
                <Center>
                  <Heading size='lg'>My account</Heading>
                </Center>
              </Box>
              {WalletBalance}
              {WalletBalanceStaked}
              {network === 'evm' && isClient && (
                <>
                  <Box key='tokensList'>
                    <TokensList isMinimized />
                  </Box>
                  <Box key='addToken'>
                    <Button p={4} w='100%' colorScheme='brand' variant='outline' onClick={onAddTokenOpen}>
                      <AddIcon mr='2' /> Add token
                    </Button>
                  </Box>
                  <AddToken isOpen={isAddTokenOpen} onClose={onAddTokenClose} />
                </>
              )}
            </VStack>
          </GridItem>
          <GridItem rowSpan={2} colSpan={4} mt={4}>
            <Tabs
              size='md'
              variant='soft-rounded'
              colorScheme='brand'
              isFitted
              onChange={handleTabChange}
              index={tabsIndex}>
              <TabList>
                <Tab>Subspace Consensus Chain</Tab>
                <Tab>Subspace Nova (EVM)</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <AmountActionAndTransactions
                    isReceiveOpen={isReceiveOpen}
                    isSendOpen={isSendOpen}
                    onReceiveOpen={onReceiveOpen}
                    onSendOpen={onSendOpen}
                    onReceiveClose={onReceiveClose}
                    onSendClose={onSendClose}
                  />
                </TabPanel>
                <TabPanel>
                  <AmountActionAndTransactions
                    isReceiveOpen={isReceiveOpen}
                    isSendOpen={isSendOpen}
                    onReceiveOpen={onReceiveOpen}
                    onSendOpen={onSendOpen}
                    onReceiveClose={onReceiveClose}
                    onSendClose={onSendClose}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>
        </Grid>
      </Card>
    )
  return (
    <Tabs size='md' variant='soft-rounded' colorScheme='brand' isFitted onChange={handleTabChange}>
      <TabList>
        <Tab>
          <SubspaceIcon width='24px' height='24px' />
          <Text ml={2}>Consensus</Text>
        </Tab>
        <Tab>
          <SubspaceIcon width='24px' height='24px' />
          <Text ml={2}>Nova (EVM)</Text>
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <AmountActionAndTransactions
            isReceiveOpen={isReceiveOpen}
            isSendOpen={isSendOpen}
            onReceiveOpen={onReceiveOpen}
            onSendOpen={onSendOpen}
            onReceiveClose={onReceiveClose}
            onSendClose={onSendClose}
          />
        </TabPanel>
        <TabPanel>
          <AmountActionAndTransactions
            isReceiveOpen={isReceiveOpen}
            isSendOpen={isSendOpen}
            onReceiveOpen={onReceiveOpen}
            onSendOpen={onSendOpen}
            onReceiveClose={onReceiveClose}
            onSendClose={onSendClose}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
