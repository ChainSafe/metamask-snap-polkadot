import { HamburgerIcon } from '@chakra-ui/icons'
import {
  AbsoluteCenter,
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  Spacer,
  Text,
  Tooltip,
  VStack,
  useColorMode,
  useMediaQuery
} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { EXTERNAL_ROUTES, layoutStyles, textStyles } from '../constants'
import { useView } from '../states/view'
import { ColorModeButton } from './buttons/colorModeButton'
import { SubspaceIcon } from './icons'

interface LayoutProps {
  children: React.ReactNode
}

const WalletButton = dynamic(() => import('./buttons/walletButton').then((m) => m.WalletButton), {
  ssr: false
})
const DisconnectButton = dynamic(() => import('./buttons/disconnectButton').then((m) => m.DisconnectButton), {
  ssr: false
})

export const Header: React.FC = () => {
  const router = useRouter()
  const [isDesktopView] = useMediaQuery('(min-width: 800px)', { ssr: true, fallback: false })

  if (isDesktopView)
    return (
      <HStack w='1200px' h='10vh' display='flex' flexDir='row'>
        <Link href='/'>
          <Image src='/logo.svg' alt='Subspace Network Logo' w={240} h='8vh' m={4} p={2} />
        </Link>
        <Spacer />
        <Box position='relative' w={360} m={4} p={2}>
          <AbsoluteCenter axis='both'>
            <Heading size='xl' whiteSpace='nowrap'>
              Wallet
            </Heading>
          </AbsoluteCenter>
        </Box>
        <Spacer />
        <ColorModeButton />
        <WalletButton />
        <DisconnectButton />
      </HStack>
    )
  return (
    <HStack w='100%' h='10vh' display='flex' flexDir='row'>
      <Box position='relative' w={18} ml={4} mr={10}>
        <Link href='/'>
          <SubspaceIcon width='24px' height='24px' />
        </Link>
      </Box>
      <Box position='relative' w={18} m={4}>
        <AbsoluteCenter axis='both'>
          <Heading size='lg' whiteSpace='nowrap'>
            Wallet
          </Heading>
        </AbsoluteCenter>
      </Box>
      <Spacer />
      <ColorModeButton />
      <Box position='relative' w={12} h='10vh' verticalAlign='center' m={2}>
        <AbsoluteCenter axis='vertical'>
          <Button colorScheme='brand' variant='outline' size='md' onClick={() => router.push('/wallets')}>
            <HamburgerIcon width='24px' height='24px' fill='#612893' />
          </Button>
        </AbsoluteCenter>
      </Box>
      <WalletButton />
      <DisconnectButton />
      <Spacer />
    </HStack>
  )
}

export const Footer: React.FC = () => {
  const { isMobile } = useView()
  const { colorMode } = useColorMode()

  const links = useMemo(
    () => (
      <Box w='100%' h='100%'>
        <Grid h='100px' templateColumns='repeat(1, 1fr)'>
          <GridItem>
            <Center>
              <Heading size='md' {...textStyles.text}>
                Other tools
              </Heading>
            </Center>
          </GridItem>
          <GridItem p={2}>
            <Link href={EXTERNAL_ROUTES.STAKING_INTERFACE} target='_blank'>
              <Text textDecoration='underline' {...textStyles.text}>
                Staking Interface
              </Text>
            </Link>
          </GridItem>
          <GridItem p={2}>
            <Link href={EXTERNAL_ROUTES.SUBSPACE_FAUCET} target='_blank'>
              <Text textDecoration='underline' {...textStyles.text}>
                Subspace Nova Faucet
              </Text>
            </Link>
          </GridItem>
          <GridItem p={2}>
            <Link href={EXTERNAL_ROUTES.ASTRAL} target='_blank'>
              <Text textDecoration='underline' {...textStyles.text}>
                Astral Explorer
              </Text>
            </Link>
          </GridItem>
          <GridItem p={2}>
            <Link href={EXTERNAL_ROUTES.NOVA_BLOCK_SCOUT} target='_blank'>
              <Text textDecoration='underline' {...textStyles.text}>
                Nova Explorer
              </Text>
            </Link>
          </GridItem>
        </Grid>
      </Box>
    ),
    []
  )

  const socials = useMemo(
    () => (
      <Box w='100%' h='100%'>
        <Center pb={3}>
          <Heading size='md' {...textStyles.text}>
            Social
          </Heading>
        </Center>
        <Grid h='100px' templateColumns='repeat(9, 1fr)'>
          <GridItem ml={1}>
            <Link href={EXTERNAL_ROUTES.DISCORD} target='_blank'>
              <Tooltip hasArrow label='Discord' aria-label='Discord' bg='brand.500'>
                <Image src='/images/socials/discord.svg' width={24} height={24} alt='Reddit' />
              </Tooltip>
            </Link>
          </GridItem>
          <GridItem ml={1}>
            <Link href={EXTERNAL_ROUTES.TELEGRAM} target='_blank'>
              <Tooltip hasArrow label='Telegram' aria-label='Discord' bg='brand.500'>
                <Image src='/images/socials/telegram.svg' width={24} height={24} alt='Reddit' />
              </Tooltip>
            </Link>
          </GridItem>
          <GridItem ml={1}>
            <Link href={EXTERNAL_ROUTES.TWITTER} target='_blank'>
              <Tooltip hasArrow label='Twitter' aria-label='Discord' bg='brand.500'>
                <Image src='/images/socials/twitter.svg' width={24} height={24} alt='Reddit' />
              </Tooltip>
            </Link>
          </GridItem>
          <GridItem ml={1}>
            <Link href={EXTERNAL_ROUTES.GITHUB} target='_blank'>
              <Tooltip hasArrow label='GitHub' aria-label='Discord' bg='brand.500'>
                <Image src='/images/socials/github.svg' width={24} height={24} alt='Reddit' />
              </Tooltip>
            </Link>
          </GridItem>
          <GridItem ml={1}>
            <Link href={EXTERNAL_ROUTES.REDDIT} target='_blank'>
              <Tooltip hasArrow label='Reddit' aria-label='Discord' bg='brand.500'>
                <Image src='/images/socials/reddit.svg' width={24} height={24} alt='Reddit' />
              </Tooltip>
            </Link>
          </GridItem>
          <GridItem ml={1}>
            <Link href={EXTERNAL_ROUTES.MEDIUM} target='_blank'>
              <Tooltip hasArrow label='Medium' aria-label='Discord' bg='brand.500'>
                <Image src='/images/socials/medium.svg' width={24} height={24} alt='Reddit' />
              </Tooltip>
            </Link>
          </GridItem>
          <GridItem ml={1}>
            <Link href={EXTERNAL_ROUTES.YOUTUBE} target='_blank'>
              <Tooltip hasArrow label='Youtube' aria-label='Discord' bg='brand.500'>
                <Image src='/images/socials/youtube.svg' width={24} height={24} alt='Reddit' />
              </Tooltip>
            </Link>
          </GridItem>
          <GridItem ml={1}>
            <Link href={EXTERNAL_ROUTES.LINKEDIN} target='_blank'>
              <Tooltip hasArrow label='Linkedin' aria-label='Discord' bg='brand.500'>
                <Image src='/images/socials/linkedin.svg' width={24} height={24} alt='Reddit' />
              </Tooltip>
            </Link>
          </GridItem>
        </Grid>
      </Box>
    ),
    []
  )

  return (
    <Box bg={colorMode === 'light' ? '#F0f0f0' : '#1A202C'} w='100%' h='200px'>
      <Box {...layoutStyles} w={['60vw', '80vw', '100vw']} p={1} pt={4} flexDir='column' m='auto'>
        <Grid templateColumns={['repeat(1, 1fr)', 'repeat(3, 1fr)', 'repeat(3, 1fr)']} gap={6}>
          {links}
          {!isMobile && <Box w='100%' h='100%'></Box>}
          {socials}
        </Grid>
      </Box>
    </Box>
  )
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <Link href='https://forum.subspace.network/t/incentivized-testnet-launch-announcement/1713'>
        <Box position='relative' w='100%' h={6} bg='brand.500' _hover={{ bg: 'brand.600' }}>
          <AbsoluteCenter axis='both'>
            <Text fontSize={[10, 14, 16]} color='white'>
              The Gemini Incentivized Testnet is LIVE!
            </Text>
          </AbsoluteCenter>
        </Box>
      </Link>
      <Center>
        <VStack h='100%' w='100%' maxW='1600px' display='flex' flexDir='column'>
          <Header />
          <Box h='100%'>{children}</Box>
        </VStack>
      </Center>
      <Footer />
    </Box>
  )
}
