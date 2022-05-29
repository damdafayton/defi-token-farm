import './App.css';
import { DAppProvider, Kovan, Rinkeby, Mainnet, Config } from "@usedapp/core"
import { Headers } from './component/Headers'
import './bootstrap'
import { Container } from '@material-ui/core'
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

function App() {
  return (
    <DAppProvider config={config}>
      <Headers></Headers>
      <Container maxWidth="md">
        <Main />
      </Container>
    </DAppProvider>
  );
}

export default App;
