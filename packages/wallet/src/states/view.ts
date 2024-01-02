import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ViewState {
  isMobile: boolean
  network: 'consensus' | 'evm'
  setIsMobile: (isMobile: boolean) => void
  setNetwork: (network: 'consensus' | 'evm') => void
}

export const useView = create<ViewState>()(
  persist(
    (set) => ({
      isMobile: false,
      network: 'consensus',
      setIsMobile: (isMobile: boolean) => set(() => ({ isMobile })),
      setNetwork: (network: 'consensus' | 'evm') => set(() => ({ network }))
    }),
    {
      name: 'view',
      version: 1
    }
  )
)
