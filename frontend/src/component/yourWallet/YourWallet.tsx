import { Token } from '../Main'
import { makeStyles, Box, Tab, CircularProgress } from '@material-ui/core'
import { TabContext, TabList, TabPanel } from '@material-ui/lab'
import React, { useState } from 'react'
import WalletBalance from './WalletBalance'
import StakeForm from './StakeForm'
import { AlertType } from '../../App'
import { useEthers, useTokenBalance } from '@usedapp/core'
import { bigNumberToReadable } from '../../helpers'
import { useTokenFarm } from '../../hooks/useTokenFarm'


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

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedTokenIndex(parseInt(newValue))
  }

  const classes = useStyles()

  const { account: user_address } = useEthers()
  const { StakingBalance } = useTokenFarm()

  const token_contract_address = supportedTokens[selectedTokenIndex].address

  const tokenBalanceData = useTokenBalance(token_contract_address, user_address)
  const readableTokenBalance = tokenBalanceData !== undefined
    && bigNumberToReadable(tokenBalanceData)

  const stakingBalanceData = StakingBalance(token_contract_address, user_address)
  const readableStakingBalance = stakingBalanceData.value
    && bigNumberToReadable(stakingBalanceData.value[0])

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
                {user_address ?
                  <div className={classes.tabContent} >
                    <WalletBalance
                      token={supportedTokens[selectedTokenIndex]}
                      readableTokenBalance={readableTokenBalance}
                      readableStakingBalance={readableStakingBalance}
                    />
                    <div className=''>
                      {(readableTokenBalance && parseInt(readableTokenBalance))
                        ? <StakeForm
                          token={token}
                          alertMessage={alertMessage}
                          setAlertMessage={setAlertMessage}
                          stake={true}
                        /> : ''}
                      {(readableStakingBalance && parseInt(readableStakingBalance)) ?
                        <StakeForm
                          token={token}
                          alertMessage={alertMessage}
                          setAlertMessage={setAlertMessage}
                          stake={false}
                        />
                        : ""}
                    </div>
                    {/* <StakedBalance token={supportedTokens[selectedTokenIndex]} /> */}
                  </div>
                  : <div className='text-center'><CircularProgress size={15} /></div>
                }
              </TabPanel>
            )
          })}
        </TabContext>
      </Box>
    </Box >
  )
}