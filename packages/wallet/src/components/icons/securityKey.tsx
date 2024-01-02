import React from 'react'
import { SvgIconProps } from './types'

export const SecurityKey: React.FC<SvgIconProps> = ({ width = '24px', height = '24px', fill = 'black' }) => {
  return (
    <svg width={width} height={height} viewBox='0 0 512 512' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M336 160H176V464H336V160Z'
        stroke={fill}
        stroke-width='18'
        stroke-miterlimit='10'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M304 48H208V160H304V48Z'
        stroke={fill}
        stroke-width='18'
        stroke-miterlimit='10'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M256 272C273.673 272 288 257.673 288 240C288 222.327 273.673 208 256 208C238.327 208 224 222.327 224 240C224 257.673 238.327 272 256 272Z'
        stroke={fill}
        stroke-width='18'
        stroke-miterlimit='10'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  )
}
