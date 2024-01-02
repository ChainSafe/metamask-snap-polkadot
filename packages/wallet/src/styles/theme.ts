import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import '@rainbow-me/rainbowkit/styles.css'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false
}

const theme = extendTheme({
  config,
  colors: {
    brand: {
      900: '#020024',
      800: '#1a0a3f',
      700: '#3a1765',
      600: '#4a1e78',
      500: '#612893',
      400: '#7746a2',
      300: '#8a5faf',
      200: '#a584c2',
      100: '#bfa6d2'
    }
  }
})

export default theme
