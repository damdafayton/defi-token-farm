import { useNotifications } from '@usedapp/core'
import { Token } from '../Main'
import { Button, CircularProgress, Snackbar } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import React, { useEffect, useState } from 'react'
import { useStakeTokens } from '../../hooks'
import { utils } from 'ethers'
import { TextField } from '@mui/material'

export interface StakeFormProps {
  token: Token
}

export default function StakeForm({ token }: StakeFormProps) {
  const { address: tokenAddress, } = token
  const { notifications } = useNotifications()

  const [amount, setAmount] = useState<number | string | Array<number | string>>('')
  const [alertMessage, setAlertMessage] = useState<string | null>("")

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = Number(event.target.value) || ""
    setAmount(newAmount)
  }

  const { approveAndStake, state: approveAndStakeErc20State } = useStakeTokens(tokenAddress)

  const handleStakeSubmit = () => {
    const amountAsWei = utils.parseEther(amount.toString())
    return approveAndStake(amountAsWei.toString())
  }

  const isMining = approveAndStakeErc20State.status === "Mining"

  useEffect(() => {
    if (notifications.filter(notification => {
      return notification.type === "transactionSucceed" &&
        notification.transactionName === "Approve ERC20 Transfer"
    }).length > 0) {
      // console.log("Approved")
      setAlertMessage("ERC-20 token transfer approved! Now approve the 2nd transaction.")
    }
    if (notifications.filter(notification => {
      return notification.type === "transactionSucceed" &&
        notification.transactionName === "Stake Tokens"
    }).length > 0) {
      setAlertMessage("Tokens staked.")
      setAmount('')
    }
  }, [notifications, alertMessage])

  const handleSnackbarClose = () => setAlertMessage(null)

  return (<>
    <div className="d-flex justify-content-center flex-column align-items-center">
      <TextField id="standard-basic" label="Stake amount" variant="standard"
        onChange={handleInputChange} value={amount}
        sx={{
          '& input': {
            textAlign: "center"
          }
        }}
      />
      <Button
        onClick={handleStakeSubmit}
        color="secondary" variant="contained" size="large" className="d-flex mt-3 min-w-120"
        disabled={isMining}
      >
        {isMining ? <CircularProgress size={26} color='inherit' /> : "Stake"}
      </Button>
    </div>
    <Snackbar
      open={Boolean(alertMessage)}
      autoHideDuration={5000}
      onClose={handleSnackbarClose}
    >
      <Alert onClose={handleSnackbarClose}>
        {alertMessage}
      </Alert>
    </Snackbar>
  </>)
}