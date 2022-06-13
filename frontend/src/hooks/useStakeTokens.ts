import { utils } from "ethers"
import { useEthers, useContractFunction } from "@usedapp/core"
import { Contract } from '@ethersproject/contracts'
import { getContractAddress } from '../helpers'
import { useState, useEffect } from "react"
import TokenFarm from '../chain-info/contracts/TokenFarm.json'
import ERC20 from '../chain-info/contracts/MockDAI.json'

export const useStakeTokens = (tokenAddress: string) => {
  /*
  prepare to call `stakeTokens` method from TokenFarm
  prepare to call `approve` method from ERC20 contract
  when user presses button to stake; pass the amount with TokenFarm address and `approve` ERC20
  state change triggers `stakeTokens` on TokenFarm
  track the state with useState
  */
  // TOKENFARM // stake tokens here
  const { chainId } = useEthers()
  const tokenFarmAddress = getContractAddress({ own_contract: 'TokenFarm', chainId })
  // console.log("TokenFarm Address = ", tokenFarmAddress)
  const { abi } = TokenFarm
  const tokenFarmInterface = new utils.Interface(abi)
  const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)
  const { send: stakeSend, state: stakeState } = useContractFunction(tokenFarmContract,
    "stakeTokens",
    {
      transactionName: "Stake Tokens"
    })

  // ERC20 TOKEN TO STAKE // approve // address, abi, chainid
  const erc20ABI = ERC20.abi
  const erc20Interface = new utils.Interface(erc20ABI)
  const erc20Contract = new Contract(tokenAddress, erc20Interface)
  // console.log(tokenFarmContract)
  const { send: approveAndStakeErc20Send, state: approveAndStakeErc20State } = useContractFunction(
    erc20Contract,
    "approve",
    {
      transactionName: "Approve ERC20 Transfer"
    })

  const approveAndStake = (amount: string) => {
    setAmountToStake(amount)
    return approveAndStakeErc20Send(tokenFarmAddress, amount)
  }

  const [amountToStake, setAmountToStake] = useState("0")
  const [state, setState] = useState(approveAndStakeErc20State)

  useEffect(() => {
    if (approveAndStakeErc20State.status === "Success") {
      // stake
      stakeSend(amountToStake, tokenAddress)
    }
  }, [approveAndStakeErc20State, tokenAddress, amountToStake])


  useEffect(() => {
    if (approveAndStakeErc20State.status === "Success") {
      setState(stakeState)
    } else {
      setState(approveAndStakeErc20State)
    }
  }, [approveAndStakeErc20State, stakeState])

  return { approveAndStake, state }

}