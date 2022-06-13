import { utils } from "ethers"
import { useEthers, useContractFunction } from "@usedapp/core"
import { Contract } from '@ethersproject/contracts'
import { getContractAddress } from '../helpers'
import { useState, useEffect } from "react"
import TokenFarm from '../chain-info/contracts/TokenFarm.json'
import ERC20 from '../chain-info/contracts/MockDAI.json'
import { useTokenFarm } from "./useTokenFarm"


export const useStakeTokens = (tokenAddress: string) => {
  /*
  prepare to call `stakeTokens` method from TokenFarm
  prepare to call `approve` method from ERC20 contract
  when user presses button to stake; pass the amount with TokenFarm address and `approve` ERC20
  state change triggers `stakeTokens` on TokenFarm
  track the state with useState
  */
  const { tokenFarmAddress, stakeTokens: tokenFarmStakeTokensSend, stakeTokensState: tokenFarmStakeTokensState } = useTokenFarm()

  // ERC20 TOKEN TO STAKE // approve // address, abi, chainid
  const erc20ABI = ERC20.abi
  const erc20Interface = new utils.Interface(erc20ABI)
  const erc20Contract = new Contract(tokenAddress, erc20Interface)
  // console.log(tokenFarmContract)
  const { send: erc20ApproveSend, state: erc20ApproveState } = useContractFunction(
    erc20Contract,
    "approve",
    {
      transactionName: "Approve ERC20 Transfer"
    })

  const [amountToStake, setAmountToStake] = useState("0")
  const [state, setState] = useState(erc20ApproveState)

  const approveAndStake = (amount: string) => {
    setAmountToStake(amount)
    return erc20ApproveSend(tokenFarmAddress, amount)
  }

  useEffect(() => {
    if (erc20ApproveState.status === "Success") {
      // stake
      tokenFarmStakeTokensSend(amountToStake, tokenAddress)
    }
  }, [erc20ApproveState, tokenAddress, amountToStake])


  useEffect(() => {
    if (erc20ApproveState.status === "Success") {
      setState(tokenFarmStakeTokensState)
    } else {
      setState(erc20ApproveState)
    }
  }, [erc20ApproveState, tokenFarmStakeTokensState])

  return { approveAndStake, state }

}