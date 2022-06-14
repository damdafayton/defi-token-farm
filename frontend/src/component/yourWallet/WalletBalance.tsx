import { Token } from '../Main'
import { useTokenFarm } from '../../hooks/useTokenFarm'
import { makeStyles, CircularProgress } from "@material-ui/core"
import { networkMap } from "../../helpers"
import { useEthers } from "@usedapp/core"

const useStyles = makeStyles(theme => ({
  container: {
    display: "block",
    gridTemplateColumns: "auto auto auto",
    gap: theme.spacing(1),
    textAlign: "center",
    alignItems: "center",
    margin: '2rem 0.5rem'
  },
  tokenImg: {
    width: "32px",
    marginBottom: "0.6rem"
  },
  amount: {
    fontWeight: 700
  }
}))

// interface BalanceMsgProps {
//   tokenName: string,
//   amount?: number | string | false,
//   stakedAmount?: number | string | false,
//   tokenImgSrc: string,
// }

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
  const { image, address: token_contract_address, name } = token
  const { tokenFarmAddress } = useTokenFarm()
  const { chainId } = useEthers()
  const classes = useStyles()

  return (<>
    <div><a href={`https://rinkeby.etherscan.io/address/${tokenFarmAddress}`} target="_blank">Stake Farm Contract</a>
    </div>
    <div><a href={`https://rinkeby.etherscan.io/address/${token_contract_address}`} target="_blank">Token Contract</a>
    </div>
    <div className={classes.container}>
      <img className={classes.tokenImg} src={token.image} alt="image logo" />
      <div>
        <div>
          <span>{`Your un-staked ${token.name} balance:`}</span>&nbsp;
          <span className={classes.amount}>{readableTokenBalance
            ? readableTokenBalance
            : <CircularProgress size={15} />
          }
          </span>
        </div>
        <div>
          <span>{`Your staked ${token.name} balance:`}</span>&nbsp;
          <span className={classes.amount}>{readableStakingBalance
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
          `You don\'t have any ${token.name} token on ${networkMap[chainId].toUpperCase()} network.`}
        </span>
        <p>Visit <a href={faucetLinks(token.name)}> {faucetLinks(token.name)}</a> to get some {token.name} token</p>
      </>
    }
  </>
  )
}