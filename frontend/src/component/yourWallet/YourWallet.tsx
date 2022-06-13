import { Token } from '../Main'
import { makeStyles, Box, Tab } from '@material-ui/core'
import { TabContext, TabList, TabPanel } from '@material-ui/lab'
import React, { useState } from 'react'
import WalletBalance from './WalletBalance'
import StakedBalance from './StakedBalance'
import { useEthers } from "@usedapp/core"
import StakeForm from './StakeForm'
import { AlertType } from '../../App'

interface YourWalletProps {
  supportedTokens: Array<Token>,
  alertMessage: null | AlertType,
  setAlertMessage: (params: any) => any
}

const useStyles = makeStyles((theme) => ({
  tabContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // gap: theme.spacing(4),
  },
  box: {
    backgroundColor: "white",
    borderRadius: "25px"
  },
  header: {
    color: "white"
  }
}))

export default function YourWallet({ supportedTokens, alertMessage, setAlertMessage }: YourWalletProps) {
  console.log("YourWallet loading..")
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
  const [balance, setBalance] = useState<string | number | false>('loading')

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedTokenIndex(parseInt(newValue))
  }

  const { account } = useEthers()
  const classes = useStyles()
  // console.log(supportedTokens, supportedTokens[selectedTokenIndex])
  return (
    <Box>
      <h1 className={`${classes.header} fs-4`}>Your Wallet</h1>
      <Box className={classes.box}>
        <TabContext value={selectedTokenIndex.toString()}>
          <TabList aria-label="stake form tabs" onChange={handleChange}>
            {supportedTokens.map((token, index) => {
              return (
                <Tab label={token.name} value={index.toString()}
                  key={index} />
              )
            })}
          </TabList>
          {supportedTokens.map((token, index) => {
            return (
              <TabPanel value={index.toString()} key={index} className="w-100">
                {account == undefined
                  ? <div className="text-center">Connect your wallet to start using the dApp</div>
                  : <div className={classes.tabContent} >
                    <WalletBalance
                      token={supportedTokens[selectedTokenIndex]}
                      balance={balance}
                      setBalance={setBalance}
                    />
                    {balance
                      ? <StakeForm
                        token={token}
                        alertMessage={alertMessage}
                        setAlertMessage={setAlertMessage}
                      /> : ''}
                    {/* <StakedBalance token={supportedTokens[selectedTokenIndex]} /> */}
                  </div>
                }
              </TabPanel>
            )
          })}
        </TabContext>
      </Box>
    </Box >
  )
}