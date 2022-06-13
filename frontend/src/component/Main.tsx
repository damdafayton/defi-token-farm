/* eslint-diable spaced-comment */
/// <reference types = "react-scripts" />

import YourWallet from "./yourWallet/YourWallet"
import { imageMapping, getContractAddress } from "../helpers"
import { useEthers } from "@usedapp/core"
import { makeStyles } from "@material-ui/core"

export type Token = {
  image: string,
  address: string,
  name: string
}

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.common.white,
    textAlign: "center",
    padding: theme.spacing(4)
  }
}))


export const Main = () => {
  const { chainId } = useEthers()
  const wethTokenAddress = getContractAddress({ external_contract: "weth_token", chainId })
  const fauTokenAddress = getContractAddress({ external_contract: "fau_token", chainId })
  const bitUsdTokenAddress = getContractAddress({ own_contract: 'BitUsdToken', chainId })
  const tokenAddressDict = { bitUsdTokenAddress, wethTokenAddress, fauTokenAddress }

  const classes = useStyles()

  const supportedTokens: Array<Token> = Object.keys(tokenAddressDict).map(address => {
    let name = address.slice(0, address.indexOf('Token')).toLowerCase()
    return {
      image: `../token_images/${imageMapping[name]}.png`,
      address: tokenAddressDict[address],
      name: name.toUpperCase()
    }
  })
  console.log(supportedTokens)
  return (
    <>
      <h2 className={classes.title}>TOKEN FARM</h2>
      <YourWallet supportedTokens={supportedTokens} />
    </>
  )
}