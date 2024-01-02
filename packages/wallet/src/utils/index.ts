import { DECIMALS } from '../constants'

export const formatAddress = (address: string): string => `${address.slice(0, 4)}...${address.slice(-6)}`

export const formatNumber = (number: number | string, decimals = 3): string => {
  if (typeof number === 'string') number = number.includes('.') ? parseFloat(number) : parseInt(number)
  return number
    .toFixed(decimals)
    .toLocaleString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const parseNumber = (number: string, decimals: number = DECIMALS): string =>
  parseFloat(number) % 1 === 0
    ? (BigInt(parseFloat(number)) * BigInt(10 ** decimals)).toString()
    : BigInt(parseFloat(number) * 10 ** decimals).toString()

export const capitalizeFirstLetter = (string: string): string => string.charAt(0).toUpperCase() + string.slice(1)

export const hexToNumber = (hex: string, decimals: number = DECIMALS): number => parseInt(hex, 16) / 10 ** decimals

export const hexToFormattedNumber = (hex: string, decimals = 3): string => formatNumber(hexToNumber(hex), decimals)

export const calculateSharedToStake = (shares: string, totalShares: string, totalStake: string): number =>
  (hexToNumber(totalStake) / hexToNumber(totalShares)) * hexToNumber(shares)

export const valueToHex = (value: string): string => '0x' + (parseFloat(value) * 10 ** DECIMALS).toString(16)

export const toHex = (value: string): string => '0x' + BigInt(value).toString(16)
