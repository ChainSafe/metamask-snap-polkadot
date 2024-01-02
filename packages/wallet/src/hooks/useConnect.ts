import { useDisclosure, useToast } from '@chakra-ui/react'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { encodeAddress } from '@polkadot/keyring'
import { useCallback, useEffect, useState } from 'react'
import { SUBSPACE_EXTENSION_ID, initialExtensionValues, toastConfig } from '../constants'
import { useExtension, useLastConnection } from '../states/extension'
import { AccountDetails } from '../types'

export const useConnect = () => {
  const {
    api,
    extension,
    subspaceAccount,
    chainDetails,
    setExtension,
    setSubspaceAccount,
    setInjectedExtension,
    setAccountDetails
  } = useExtension()
  const toast = useToast()
  const { isOpen: isConnectOpen, onOpen: onConnectOpen, onClose: onConnectClose } = useDisclosure()
  const { subspaceAccount: lastSubspaceAccount, setSubspaceAccount: setLastSubspaceAccount } = useLastConnection()
  const { ss58Format } = chainDetails
  const [walletsTypeSet, setWalletsTypeSet] = useState<Set<string>>(new Set())

  const handleConnect = useCallback(async () => {
    setExtension({ ...initialExtensionValues, loading: true })

    web3Enable(SUBSPACE_EXTENSION_ID)
      .then((injectedExtensions) => {
        if (!injectedExtensions.length) return Promise.reject(new Error('NO_INJECTED_EXTENSIONS'))
        setInjectedExtension(injectedExtensions[0])

        return web3Accounts()
      })
      .then(async (accounts) => {
        if (!accounts.length) return Promise.reject(new Error('NO_ACCOUNTS'))

        setWalletsTypeSet(new Set(accounts.map((account) => account.meta.source)))

        const lastAccount = accounts.find((account) => account.address === lastSubspaceAccount)
        const defaultAccount = lastAccount ? lastAccount : accounts[0]

        const currentAccounts = extension.data?.accounts || []
        const newAccounts = accounts.filter(
          (account) => !currentAccounts.find((acc) => acc.address === account.address)
        )

        const sortedAccounts = [...currentAccounts, ...newAccounts].sort((a, b) => {
          if (a.meta.source === b.meta.source) return 0
          if (a.meta.source === 'polkadot-js') return -1
          if (b.meta.source === 'polkadot-js') return 1
          return 0
        })

        setExtension({
          error: null,
          loading: false,
          data: {
            accounts: sortedAccounts,
            defaultAccount
          }
        })
        setSubspaceAccount(encodeAddress(defaultAccount.address, ss58Format))
      })
      .catch((error) => {
        console.error('Error with connect', error)
        setExtension({ error, loading: false, data: undefined })
      })
  }, [lastSubspaceAccount, setExtension, setInjectedExtension, setLastSubspaceAccount, setSubspaceAccount, ss58Format])

  const handleSelectFirstWalletFromExtension = useCallback(
    async (source: string) => {
      await handleConnect()
      const mainAccount = extension.data?.accounts.find((account) => account.meta.source === source)
      if (mainAccount && extension.data) {
        setExtension({
          ...extension,
          data: {
            ...extension.data,
            defaultAccount: mainAccount
          }
        })
        setSubspaceAccount(encodeAddress(mainAccount.address, ss58Format))
        setLastSubspaceAccount(mainAccount.address)
      }
      onConnectClose()
    },
    [handleConnect, extension, onConnectClose, setExtension, setSubspaceAccount, ss58Format, setLastSubspaceAccount]
  )

  const handleSelectWallet = useCallback(
    async (address: string) => {
      const mainAccount = extension.data?.accounts.find((account) => account.address === address)
      if (mainAccount && extension.data) {
        setExtension({
          ...extension,
          data: {
            ...extension.data,
            defaultAccount: mainAccount
          }
        })
        setSubspaceAccount(encodeAddress(mainAccount.address, ss58Format))
        setLastSubspaceAccount(mainAccount.address)
      }
    },
    [extension, setExtension, setLastSubspaceAccount, setSubspaceAccount, ss58Format]
  )

  const handleRefreshBalance = useCallback(async () => {
    if (!api || !extension.data) return

    const rawAccountDetails = await api.query.system.account(extension.data.defaultAccount.address)
    const accountDetails = rawAccountDetails.toJSON() as AccountDetails
    setAccountDetails(accountDetails)
  }, [api, extension.data, setAccountDetails])

  const handleDisconnect = useCallback(() => {
    setExtension(initialExtensionValues)
    setLastSubspaceAccount(undefined)
  }, [setExtension, setLastSubspaceAccount])

  useEffect(() => {
    if (api && extension.data) handleRefreshBalance()
  }, [api, extension.data, handleRefreshBalance])

  useEffect(() => {
    if (lastSubspaceAccount && !subspaceAccount) handleConnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (walletsTypeSet.size > 1)
      toast({
        title: 'Multiple wallet extensions detected',
        description: 'In some cases, having multiple wallet extensions enabled at the same time can cause issues.',
        status: 'warning',
        ...toastConfig
      })
  }, [toast, walletsTypeSet])

  return {
    handleConnect,
    handleSelectFirstWalletFromExtension,
    handleSelectWallet,
    handleDisconnect,
    onConnectOpen,
    isConnectOpen,
    onConnectClose
  }
}
