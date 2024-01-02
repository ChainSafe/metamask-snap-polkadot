import { Button, ButtonGroup } from '@chakra-ui/react'

interface AmountsButtonProps {
  amounts?: string[]
  handleSetAmount: (amount: string) => void
}

interface AmountButtonProps {
  amount: string
  handleSetAmount: (amount: string) => void
}

const DEFAULT_AMOUNTS = ['0.1', '1', '10', '100']

export const AmountButton: React.FC<AmountButtonProps> = ({ amount, handleSetAmount }) => {
  return (
    <Button size='xs' variant='outline' colorScheme='brand' mt={2} onClick={() => handleSetAmount(amount)}>
      {amount}
    </Button>
  )
}

export const AmountsButton: React.FC<AmountsButtonProps> = ({ amounts = DEFAULT_AMOUNTS, handleSetAmount }) => {
  return (
    <ButtonGroup mt={2} size='sm' isAttached variant='outline'>
      {amounts.map((amount, key) => (
        <AmountButton key={key} amount={amount} handleSetAmount={handleSetAmount} />
      ))}
    </ButtonGroup>
  )
}
