import { Box } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { WalletsConnectorGrid } from '../components/modals/walletsConnector'
import { useOnchainData } from '../hooks/useOnchainData'
import { useExtension } from '../states/extension'

const Page: React.FC = () => {
  const { subspaceAccount } = useExtension()
  const { handleOnchainData } = useOnchainData()

  useEffect(() => {
    handleOnchainData()
  }, [handleOnchainData, subspaceAccount])

  return (
    <Box>
      <WalletsConnectorGrid />
    </Box>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Wallet' } }
}

export default Page
