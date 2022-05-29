import { Token } from '../Main'
import { useEthers, useTokenBalance } from '@usedapp/core'
import BalanceMsg from './BalanceMsg'
import { formatTokenBalance } from '../../helpers'
import { useState, useEffect } from 'react'
import StakeForm from './StakeForm'

// import { useUnstakeTokens } from '../../hooks'

export interface WalletBalanceProps {
  token: Token
}

export default function WalletBalance({ token }: WalletBalanceProps) {
  const [balance, setBalance] = useState<string | number | false>('loading')
  const { image, address: contract_address, name } = token
  const { account: user_address } = useEthers()
  // const { farmTokenStakingBalance, farmTokenStakingBalanceState } = useUnstakeTokens()
  // const stakedAmount = farmTokenStakingBalance(contract_address, user_address)
  // console.log("Staked amount = ", stakedAmount)

  // console.log(account)
  // console.log(name, address, tokenBalance?.toString())
  const tokenBalance = useTokenBalance(contract_address, user_address)
  useEffect(() => {
    const formattedTokenBalance = tokenBalance !== undefined && formatTokenBalance(tokenBalance)
    setBalance(formattedTokenBalance)
  }, [tokenBalance])

  return (<>
    <BalanceMsg
      tokenName={name}
      tokenImgSrc={image}
      amount={balance}
    />
    {balance ? <StakeForm token={token} /> : ''}
  </>
  )
}