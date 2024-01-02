import { Card } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Wallet } from '../components/wallet'
import { useOnchainData } from '../hooks/useOnchainData'
import { useExtension } from '../states/extension'

const Page: React.FC = () => {
  const { subspaceAccount } = useExtension()
  const { handleOnchainData } = useOnchainData()

  useEffect(() => {
    handleOnchainData()
  }, [handleOnchainData, subspaceAccount])

  return <Wallet />
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Wallet' } }
}

export default Page
