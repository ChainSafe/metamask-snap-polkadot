import { AbsoluteCenter, Box, Button, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { MoonIcon, SunIcon } from '../icons'

export const ColorModeButton: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box position='relative' w={12} h='10vh' verticalAlign='center' m={4} p={2}>
      <AbsoluteCenter axis='both'>
        <Button
          variant='outline'
          colorScheme='brand'
          rightIcon={
            colorMode === 'light' ? (
              <MoonIcon width='24px' height='24px' fill='#612893' />
            ) : (
              <SunIcon width='24px' height='24px' fill='#612893' />
            )
          }
          onClick={() => toggleColorMode()}
        />
      </AbsoluteCenter>
    </Box>
  )
}
