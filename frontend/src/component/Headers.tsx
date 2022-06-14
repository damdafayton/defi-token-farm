import { useEthers } from "@usedapp/core"
import { Button } from "@mui/material"
import styles from './Styles.module.css'


export const Headers = () => {
  const { account, activateBrowserWallet, deactivate } = useEthers()

  const isConnected = account !== undefined

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