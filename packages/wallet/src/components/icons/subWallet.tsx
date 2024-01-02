import React from 'react'
import { SvgIconProps } from './types'

export const SubWallet: React.FC<SvgIconProps> = ({ width = '256px', height = '256px', fill = 'black' }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_4_9" maskUnits="userSpaceOnUse" x="95" y="15" width="322" height="482">
<path d="M416.119 15H95V496.178H416.119V15Z" fill="white"/>
</mask>
<g mask="url(#mask0_4_9)">
<path d="M416.119 189.026V122.253L148.472 15L95 42.127L95.2821 249.956L295.523 330.5L188.577 375.989V340.812L139.478 320.901L95.2821 341.768V469.052L148.519 496.179L416.119 375.571V290.019L175.279 193.721V135.296L366.361 211.561L416.119 189.026Z" fill="black"/>
</g>
</svg>
  )
}
