import { useState, useEffect } from "react"

import { utils } from "ethers"
import { useEthers, useContractFunction, useCall } from "@usedapp/core"
import { Contract } from '@ethersproject/contracts'

import { getContractAddress } from '../helpers'
import TokenFarm from '../chain-info/contracts/TokenFarm.json'

export const useTokenFarm = () => {
  const { chainId } = useEthers()
  const tokenFarmAddress = getContractAddress({ own_contract: 'TokenFarm', chainId })
  const { abi } = TokenFarm
  const tokenFarmInterface = new utils.Interface(abi)
  const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

  const { send: stakeTokens, state: stakeTokensState } = useContractFunction( // (amount, token)
    tokenFarmContract,
    "stakeTokens",
    {
      transactionName: "stakeTokens"
    })

  // const { send: unStakeTokens, state: unStakeTokensState } = //FarmContractFunctionHookMaker("unStakeTokens")  //  (token)

  const StakingBalance = (token_address: string, user_address: string) => {
    const { value, error } = useCall({
      contract: tokenFarmContract,
      method: "stakingBalance",
      args: [token_address, user_address]
    }) ?? {}
    return { value, error }
  }


  return ({ tokenFarmAddress, stakeTokens, stakeTokensState, StakingBalance })
}