import { useEthers } from "@usedapp/core"
import { Button } from "@mui/material"
import styles from './Styles.module.css'


export const Headers = () => {
  const { account, activateBrowserWallet, deactivate, chainId } = useEthers()

  const isConnected = account != undefined

  // const classes = useStyles()
  return (
    <div className={styles.container}>
      <div>
        {isConnected ?
          <Button color="primary" variant="contained" onClick={deactivate}>Disconnect</Button>
          :
          <Button color="primary" variant="contained" onClick={activateBrowserWallet}>Connect</Button>}
      </div>
    </div>
  )
}