import { Token } from '../Main'
import { useEthers, useTokenBalance } from '@usedapp/core'
import BalanceMsg from './BalanceMsg'
import { formatTokenBalance } from '../../helpers'
import { useState, useEffect } from 'react'


export interface WalletBalanceProps {
  token: Token,
  balance: string | number | false,
  setBalance: (params: any) => any
}

export default function WalletBalance({ token, balance, setBalance }: WalletBalanceProps) {
  const { image, address: contract_address, name } = token
  const { account: user_address } = useEthers()

  // console.log("WalletBalance loading.. ", token.name)
  const tokenBalance = useTokenBalance(contract_address, user_address)
  const formattedTokenBalance = tokenBalance !== undefined && formatTokenBalance(tokenBalance)
  useEffect(() => {
    // if return value is false hook didnt work so dont update
    formattedTokenBalance !== false && setBalance(formattedTokenBalance)
  }, [formattedTokenBalance])

  // useEffect(() => {
  // console.log("Staked amount = ", stakedAmount)
  // }, [stakedAmount])

  return (<>
    <BalanceMsg
      tokenName={name}
      tokenImgSrc={image}
      amount={balance}
    />
  </>
  )
}