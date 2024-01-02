export const layoutStyles = {
  maxW: '1600px',
  display: 'flex'
}

export const pageStyles = {
  minW: '60vw',
  maxW: '1600px',
  mt: '10',
  p: '4',
  border: '0'
}

export const headingStyles = {
  page: {
    size: 'lg',
    fontWeight: '700',
    fontSize: { base: '24px', md: '26px', lg: '30px' },
    ml: '2',
    color: '#000000'
  },
  paragraph: {
    size: 'lg',
    fontWeight: '500',
    fontSize: { base: '24px', md: '32px', lg: '40px' },
    color: '#5B5252'
  },
  paragraphExtra: {
    size: 'lg',
    fontWeight: '500',
    fontSize: { base: '18px', md: '22px', lg: '24px' },
    mt: ['8px', '12px', '16px'],
    color: '#5B5252'
  }
}

export const textStyles = {
  heading: {
    fontWeight: '500',
    fontSize: { base: '18px', md: '20px', lg: '26px' },
    color: '#5B5252'
  },
  value: {
    fontWeight: '700',
    fontSize: ['18px', '22px', '28px'],
    color: '#5B5252'
  },
  link: {
    textDecoration: 'underline',
    color: '#4524C1',
    mt: '4'
  },
  text: {
    color: '#5B5252'
  }
}

export const tableStyles = {
  borderColor: '#B9B9B9',
  border: '1',
  variant: 'striped',
  size: 'sm'
}

export const tHeadStyles = {
  bg: 'rgba(0, 0, 0, 0.06)'
}

export const buttonStyles = {
  bgGradient: 'linear(to-r, #846F87, #4D397A)',
  color: '#FFFFFF',
  borderRadius: '0',
  mt: '8',
  pl: '16px',
  pr: '16px',
  pt: '8px',
  pb: '7px',
  w: '228px',
  _hover: {
    bgGradient: 'linear(to-r, #4D397A, #846F87)'
  }
}

export const connectWalletButtonStyles = {
  ...buttonStyles,
  mt: 0,
  bgGradient: 'linear(to-r, #EA71F9, #4D397A)',
  minW: '150px',
  _hover: {
    bgGradient: 'linear(to-r, #4D397A, #EA71F9)'
  },
  _active: {
    bgGradient: 'linear(to-r, #4D397A, #EA71F9)'
  }
}

export const actionButtonStyles = {
  ...connectWalletButtonStyles,
  variant: 'outline',
  color: 'brand.500',
  minW: '40px',
  bgGradient: undefined,
  border: '1px solid #4D397A',
  borderRadius: 6,
  size: 'sm',
  _hover: {
    bgGradient: 'linear(to-r, #4D397A, #EA71F9)',
    color: '#FFFFFF'
  },
  _active: {
    bgGradient: 'linear(to-r, #4D397A, #EA71F9)',
    color: '#FFFFFF'
  }
}
