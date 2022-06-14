import { Token } from '../Main'
import { useTokenFarm } from '../../hooks/useTokenFarm'
import { CircularProgress } from "@mui/material"
import { networkMap } from "../../helpers"
import { useEthers } from "@usedapp/core"
import styles from './Styles.module.css'

const faucetLinks = (token: string) => {
  const links = {
    FAU: "https://erc20faucet.com",
    BITUSD: "FAUCET UNDER CONSTRUCTION",
    WETH: "https://app.aave.com"
  }
  return links[token]
}
export interface WalletBalanceProps {
  token: Token,
  readableTokenBalance: string | number | false,
  readableStakingBalance: string | number | false,
}

export default function WalletBalance({ token, readableTokenBalance, readableStakingBalance }: WalletBalanceProps) {
  const { address: token_contract_address } = token
  const { tokenFarmAddress } = useTokenFarm()
  const { chainId } = useEthers()

  return (<>
    <div><a href={`https://rinkeby.etherscan.io/address/${tokenFarmAddress}`} target="_blank" rel="noreferrer">Stake Farm Contract</a>
    </div>
    <div><a href={`https://rinkeby.etherscan.io/address/${token_contract_address}`} target="_blank" rel="noreferrer">Token Contract</a>
    </div>
    <div className={styles.container}>
      <img className={styles.tokenImg} src={token.image} alt="logo" />
      <div>
        <div>
          <span>{`Your un-staked ${token.name} balance:`}</span>&nbsp;
          <span className={styles.amount}>{readableTokenBalance
            ? readableTokenBalance
            : <CircularProgress size={15} />
          }
          </span>
        </div>
        <div>
          <span>{`Your staked ${token.name} balance:`}</span>&nbsp;
          <span className={styles.amount}>{readableStakingBalance
            ? readableStakingBalance
            : <CircularProgress size={15} />
          }
          </span>
        </div>
      </div>
    </div>
    {
      readableTokenBalance === "0" && <>
        <span>{chainId &&
          `You don't have any ${token.name} token on ${networkMap[chainId].toUpperCase()} network.`}
        </span>
        <p>Visit <a href={faucetLinks(token.name)}> {faucetLinks(token.name)}</a> to get some {token.name} token</p>
      </>
    }
  </>
  )
}