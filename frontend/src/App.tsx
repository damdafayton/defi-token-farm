import { useState } from 'react';
import './App.css';
import { DAppProvider, Kovan, Rinkeby, Mainnet, Config } from "@usedapp/core"
import { Headers } from './component/Headers'
import './bootstrap'
import { Container, Snackbar, Alert } from "@mui/material"
import { Main } from './component/Main'
import { getDefaultProvider } from 'ethers'


const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: getDefaultProvider('mainnet'),
    [Kovan.chainId]: getDefaultProvider('kovan', {
      infura: process.env.REACT_APP_WEB3_INFURA_PROJECT_ID,
      alchemy: process.env.REACT_APP_WEB3_ALCHEMY_API_KEY
    }),
    [Rinkeby.chainId]: getDefaultProvider('rinkeby', {
      infura: process.env.REACT_APP_WEB3_INFURA_PROJECT_ID
    })
  },
  notifications: {
    expirationPeriod: 1000,
    checkInterval: 1000,
  }
}

export type AlertType = {
  status: 'success' | 'info' | 'warning' | 'error',
  msg: string
}

function App() {
  const [_alertMessage, _setAlertMessage] = useState<AlertType | null>(null)

  const handleSnackbarClose = () => _setAlertMessage(null)

  return (
    <DAppProvider config={config}>
      <Headers></Headers>
      <Container maxWidth="md">
        <Main
          alertMessage={_alertMessage}
          setAlertMessage={_setAlertMessage}
        />
        <Snackbar
          open={Boolean(_alertMessage)}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
        >
          <Alert
            severity={_alertMessage?.status}
            onClose={handleSnackbarClose}>
            {_alertMessage?.msg}
          </Alert>
        </Snackbar>
      </Container>
    </DAppProvider>
  );
}

export default App;
