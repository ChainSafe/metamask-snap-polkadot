import { AbsoluteCenter, Box, Button } from '@chakra-ui/react'
import React from 'react'
import { useAccountStatus, useDisconnectAll } from '../../hooks/useNetwork'
import { DisconnectIcon } from '../icons'

export const DisconnectButton: React.FC = () => {
  const { isConnected } = useAccountStatus()
  const { disconnectAll } = useDisconnectAll()

  if (!isConnected) return null

  return (
    <Box position='relative' w={12} h='10vh' verticalAlign='center' m={4} p={2}>
      <AbsoluteCenter axis='vertical'>
        <Button colorScheme='brand' variant='outline' size='md' onClick={disconnectAll}>
          <DisconnectIcon width='24px' height='24px' fill='#612893' />
        </Button>
      </AbsoluteCenter>
    </Box>
  )
}
