/* eslint-diable spaced-comment */
/// <reference types = "react-scripts" />
import { useEffect, useState } from "react"
import YourWallet from "./yourWallet/YourWallet"
import { imageMapping, getContractAddress, networkMap } from "../helpers"
import { useEthers } from "@usedapp/core"
import { makeStyles } from "@material-ui/core"
import { AlertType } from '../App'
import { Alert } from "@material-ui/lab"

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


export const Main = ({ alertMessage, setAlertMessage }:
  { alertMessage: null | AlertType, setAlertMessage: (params: any) => any }) => {
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
  console.log(chainId)


  const [pageAlert, setPageAlert] = useState<AlertType | null>(null)
  useEffect(() => {
    if (!chainId || !Object.keys(networkMap).includes(chainId.toString())) {
      setPageAlert({ status: "error", msg: "Change your network to Rinkeby" })
    }
  }, [chainId])

  return (
    <>
      <h2 className={classes.title}>TOKEN FARM</h2>
      {pageAlert &&
        <Alert
          className='my-2'
          severity={pageAlert?.status}
          onClose={() => setPageAlert(null)}>
          {pageAlert?.msg}
        </Alert>
      }
      <YourWallet
        supportedTokens={supportedTokens}
        alertMessage={alertMessage}
        setAlertMessage={setAlertMessage}
      />
    </>
  )
}