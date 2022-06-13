import { Token } from '../Main'
import { useEthers, useTokenBalance } from '@usedapp/core'
import BalanceMsg from './BalanceMsg'
import { bigNumberToReadable } from '../../helpers'
import { useTokenFarm } from '../../hooks/useTokenFarm'



export interface WalletBalanceProps {
  token: Token,
  balance: string | number | false,
  setBalance: (params: any) => any
}

export default function WalletBalance({ token, balance, setBalance }: WalletBalanceProps) {
  const { image, address: token_contract_address, name } = token
  const { tokenFarmAddress, StakingBalance } = useTokenFarm()
  const { account: user_address } = useEthers()

  const tokenBalanceData = useTokenBalance(token_contract_address, user_address)
  const readableTokenBalance = tokenBalanceData !== undefined && bigNumberToReadable(tokenBalanceData) || 'loading'

  const stakingBalanceData = user_address && StakingBalance(token_contract_address, user_address)
  const readableStakingBalance = stakingBalanceData &&
    stakingBalanceData.value &&
    bigNumberToReadable(stakingBalanceData.value[0]) || 'loading'

  return (<>
    <div><a href={`https://rinkeby.etherscan.io/address/${tokenFarmAddress}`} target="_blank">Stake Farm Contract</a>
    </div>
    <div><a href={`https://rinkeby.etherscan.io/address/${token_contract_address}`} target="_blank">Token Contract</a>
    </div>
    <BalanceMsg
      tokenName={name}
      tokenImgSrc={image}
      amount={readableTokenBalance}
      stakedAmount={readableStakingBalance}
    />
  </>
  )
}