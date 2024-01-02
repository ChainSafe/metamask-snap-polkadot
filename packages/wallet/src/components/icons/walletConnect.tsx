import React from 'react'
import { SvgIconProps } from './types'

export const WalletConnect: React.FC<SvgIconProps> = ({ width = '256px', height = '256px', fill = 'black' }) => {
  return (
    <svg width={width} height={height} viewBox='0 0 512 512' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0Z'
        fill='url(#paint0_radial_9_84)'
      />
      <path
        d='M162.7 197.7C214.2 147.4 297.8 147.4 349.3 197.7L355.5 203.8C358.1 206.3 358.1 210.4 355.5 212.9L334.3 233.6C333 234.9 330.9 234.9 329.6 233.6L321.1 225.3C285.1 190.2 226.9 190.2 190.9 225.3L181.8 234.2C180.5 235.5 178.4 235.5 177.1 234.2L155.9 213.5C153.3 211 153.3 206.9 155.9 204.4L162.7 197.7ZM393.2 240.5L412.1 258.9C414.7 261.4 414.7 265.5 412.1 268L327 351.1C324.4 353.6 320.2 353.6 317.7 351.1L257.3 292.1C256.7 291.5 255.6 291.5 255 292.1L194.6 351.1C192 353.6 187.8 353.6 185.3 351.1L99.9002 268C97.3002 265.5 97.3002 261.4 99.9002 258.9L118.8 240.5C121.4 238 125.6 238 128.1 240.5L188.5 299.5C189.1 300.1 190.2 300.1 190.8 299.5L251.2 240.5C253.8 238 258 238 260.5 240.5L320.9 299.5C321.5 300.1 322.6 300.1 323.2 299.5L383.6 240.5C386.4 238 390.6 238 393.2 240.5Z'
        fill='white'
      />
      <defs>
        <radialGradient
          id='paint0_radial_9_84'
          cx='0'
          cy='0'
          r='1'
          gradientUnits='userSpaceOnUse'
          gradientTransform='translate(0.00158691 256.008) scale(512)'>
          <stop stopColor='#5D9DF6' />
          <stop offset='1' stopColor='#006FFF' />
        </radialGradient>
      </defs>
    </svg>
  )
}
