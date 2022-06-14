import { useNotifications } from '@usedapp/core'
import { Token } from '../Main'
import { Button, CircularProgress } from "@material-ui/core"
import React, { useEffect, useState } from 'react'
import { useStakeTokens } from '../../hooks'
import { utils } from 'ethers'
import { TextField } from '@mui/material'
import { AlertType } from '../../App'
import { useTokenFarm } from '../../hooks/useTokenFarm'

export interface StakeFormProps {
  stake: boolean,
  token: Token,
  alertMessage: null | AlertType,
  setAlertMessage: (params: any) => any
}

// <stake> prop changes the module behaves. it is implemented to enable fractional un-staking which
// is not supported by Contract currently
export default function StakeForm({ stake = false, token, alertMessage, setAlertMessage }: StakeFormProps) {
  const { address: tokenAddress, } = token
  const { notifications } = useNotifications()

  const [stakeAmount, setStakeAmount] = useState<number | string | Array<number | string>>('')
  const [unStakeAmount, setUnStakeAmount] = useState<number | string | Array<number | string>>('')


  const { approveAndStake, state: approveAndStakeErc20State } = useStakeTokens(tokenAddress)
  const { unStakeTokens, unStakeTokensState } = useTokenFarm()

  const handleStakeSubmit = () => {
    const stakeAmountAsWei = utils.parseEther(stakeAmount.toString())
    return approveAndStake(stakeAmountAsWei.toString())
  }

  const handleUnStakeSubmit = () => {
    return unStakeTokens(tokenAddress)
  }

  const isMiningStaking = approveAndStakeErc20State.status === "Mining"
  const isMiningUnStaking = unStakeTokensState.status === "Mining"

  const handleStakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = Number(event.target.value) || ""
    setStakeAmount(newAmount)
  }
  const handleUnStakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = Number(event.target.value) || ""
    setUnStakeAmount(newAmount)
  }

  useEffect(() => {
    // Stake notification filters
    if (notifications.filter(notification => {
      return notification.type === "transactionSucceed"
        && notification.transactionName === "Approve ERC20 Transfer"
    }).length > 0) {
      // console.log("Approved")
      setAlertMessage({ status: "success", msg: "ERC-20 token transfer approved! Now approve the 2nd transaction." })
    }
    if (notifications.filter(notification => {
      return notification.type === "transactionSucceed"
        && notification.transactionName === "stakeTokens"
    }).length > 0) {
      setAlertMessage({ status: "success", msg: "Tokens staked." })
      setStakeAmount('')
    }
    // Unstake notification filters
    if (notifications.filter(notification => {
      return notification.type === "transactionSucceed"
        && notification.transactionName === "unStakeTokens"
    }).length > 0) {
      // console.log("Approved")
      setAlertMessage({ status: "success", msg: "Tokens un-staked successfully." })
    }
  }, [notifications, alertMessage])


  return (<>
    <div className="d-flex justify-content-center flex-column align-items-center">
      {stake &&
        <TextField id="standard-basic" label={stake ? "Stake amount" : "Un-stake amount"} variant="standard"
          onChange={stake ? handleStakeInputChange : handleUnStakeInputChange}
          value={stake ? stakeAmount : unStakeAmount}
          sx={{
            '& input': {
              textAlign: "center"
            }
          }}
        />}
      <Button
        onClick={stake ? handleStakeSubmit : handleUnStakeSubmit}
        color={stake ? "secondary" : "primary"} variant="contained" size="large" className="d-flex mt-3 min-w-120"
        disabled={stake ? isMiningStaking : isMiningUnStaking}
      >
        {stake && (isMiningStaking ? <CircularProgress size={26} color='inherit' /> : "Stake")}
        {!stake && (isMiningUnStaking ? <CircularProgress size={26} color='inherit' /> : "Un-stake All")}
      </Button>
    </div>
  </>)
}