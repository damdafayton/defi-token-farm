import { useEthers } from "@usedapp/core"
import { useUnstakeTokens } from '../../hooks'
import { Token } from "../Main"

export default function StakedBalance({ token: { address: contract_address } }: { token: Token }) {
  const { account: user_address } = useEthers()
  const { farmTokenStakingBalance, farmTokenStakingBalanceState } = useUnstakeTokens()
  const stakedAmount = farmTokenStakingBalance(contract_address, user_address)
  // console.log(stakedAmount)

  return (<div></div>)
}