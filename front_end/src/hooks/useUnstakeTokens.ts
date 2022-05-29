import { useEthers, useContractFunction } from '@usedapp/core'
import { getContractAddress } from '../helpers'
import TokenFarm from '../chain-info/contracts/TokenFarm.json'
import { utils } from 'ethers'
import { Contract } from '@ethersproject/contracts'


export const useUnstakeTokens = () => {
  const { chainId } = useEthers()
  const tokenFarmAddress = getContractAddress({ own_contract: "TokenFarm", chainId })
  const { abi } = TokenFarm
  const tokenFarmInterface = new utils.Interface(abi)
  const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)
  const { send: farmTokenStakingBalance, state: farmTokenStakingBalanceState } = useContractFunction(tokenFarmContract, "stakingBalance", { transactionName: "Query Staked Balance" })

  return { farmTokenStakingBalance, farmTokenStakingBalanceState }
}