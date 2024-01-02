import type { BaseToken } from '../types'

export const mockTokens: BaseToken[] = [
  {
    chainId: 1002,
    address: '0x3558bD588Ed5cdF0D4aC5327f112c91346928a51'
  }
]

export const supportedTokens: BaseToken[] = [
  ...mockTokens,
  {
    chainId: 1002,
    address: '0xcF17D3873A99CE44c6C04E279857b9f06E1C083a'
  }
]
