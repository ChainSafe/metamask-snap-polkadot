import { ColorModeScript } from '@chakra-ui/color-mode'
import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import React from 'react'
import { Layout } from '../components/layout'
import { Web3Provider } from '../components/web3Provider'
import Header from '../config'
import { SnapContextProvider } from '../context/snapProvider'
import theme from '../styles/theme'

const App: React.FC<AppProps> = ({ Component, pageProps = { title: 'Subspace Wallet' } }) => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Header title={pageProps.title} />
      <Web3Provider>
        {/* <SnapContextProvider> */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
        {/* </SnapContextProvider> */}
      </Web3Provider>
    </ChakraProvider>
  )
}

export default App
