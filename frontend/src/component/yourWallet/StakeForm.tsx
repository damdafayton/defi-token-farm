import { useNotifications } from '@usedapp/core'
import { Token } from '../Main'
import { Button, CircularProgress } from "@material-ui/core"
import React, { useEffect, useState } from 'react'
import { useStakeTokens } from '../../hooks'
import { utils } from 'ethers'
import { TextField } from '@mui/material'
import { AlertType } from '../../App'

export interface StakeFormProps {
  token: Token,
  alertMessage: null | AlertType,
  setAlertMessage: (params: any) => any
}

export default function StakeForm({ token, alertMessage, setAlertMessage }: StakeFormProps) {
  const { address: tokenAddress, } = token
  const { notifications } = useNotifications()

  const [amount, setAmount] = useState<number | string | Array<number | string>>('')

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
      setAlertMessage({ status: "success", msg: "ERC-20 token transfer approved! Now approve the 2nd transaction." })
    }
    if (notifications.filter(notification => {
      return notification.type === "transactionSucceed" &&
        notification.transactionName === "Stake Tokens"
    }).length > 0) {
      setAlertMessage({ status: "success", msg: "Tokens staked." })
      setAmount('')
    }
  }, [notifications, alertMessage])

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
  </>)
}