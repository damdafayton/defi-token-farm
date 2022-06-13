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

interface BalanceMsgProps {
  tokenName: string,
  amount?: number | string | false,
  stakedAmount?: number | string | false,
  tokenImgSrc: string,
}

const faucetLinks = (token: string) => {
  const links = {
    FAU: "https://erc20faucet.com",
    BITUSD: window.location.origin + "/faucet",
    WETH: "https://app.aave.com"
  }
  return links[token]
}

export default function BalanceMsg({ tokenName, amount, stakedAmount, tokenImgSrc }: BalanceMsgProps) {
  const { chainId } = useEthers()
  const classes = useStyles()
  return (
    <>
      <div className={classes.container}>
        <img className={classes.tokenImg} src={tokenImgSrc} alt="image logo" />
        <div>
          <div>
            <span>{`Your un-staked ${tokenName} balance:`}</span>&nbsp;
            <span className={classes.amount}>{amount === "loading"
              ? <CircularProgress size={15} />
              : amount}
            </span>
          </div>
          <div>
            <span>{`Your staked ${tokenName} balance:`}</span>&nbsp;
            <span className={classes.amount}>{stakedAmount === "loading"
              ? <CircularProgress size={15} />
              : stakedAmount}
            </span>
          </div>
        </div>
      </div>
      {
        amount === 0 && <>
          <span>{chainId &&
            `You don\'t have any ${tokenName} token on ${networkMap[chainId].toUpperCase()} network.`}
          </span>
          <p>Visit <a href={faucetLinks(tokenName)}> {faucetLinks(tokenName)}</a> to get some {tokenName} token</p>,
        </>
      }
    </>
  )
}