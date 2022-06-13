import { makeStyles, CircularProgress } from "@material-ui/core"
import { networkMap } from "../../helpers"
import { useEthers } from "@usedapp/core"
import { error } from "console"

const useStyles = makeStyles(theme => ({
  container: {
    display: "block",
    gridTemplateColumns: "auto auto auto",
    gap: theme.spacing(1),
    textAlign: "center",
    alignItems: "center",
    marginBottom: '2rem'
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
  tokenImgSrc: string
}

const faucetLinks = (token: string) => {
  const links = {
    FAU: "https://erc20faucet.com",
    BITUSD: window.location.origin + "/faucet",
    WETH: "https://app.aave.com"
  }
  return links[token]
}

export default function BalanceMsg({ tokenName, amount, tokenImgSrc }: BalanceMsgProps) {
  const { chainId } = useEthers()
  const classes = useStyles()
  return (
    <>
      <div className={classes.container}>
        <img className={classes.tokenImg} src={tokenImgSrc} alt="image logo" />
        <span className="d-flex">
          <div>{`Your un-staked ${tokenName} balance:`}</div>&nbsp;
          <div className={classes.amount}>{amount === "loading"
            ? <CircularProgress size={15} />
            : amount}</div>
        </span>
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