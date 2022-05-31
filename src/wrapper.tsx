import { Connection } from '@solana/web3.js'
import App from 'App'
import ParserProvider from './providers/parser.provider'

const Wrapper = () => {
  const connection = new Connection('https://api.devnet.solana.com')
  return (
    <ParserProvider
      walletAddress="BkLRcJucoTF9GnxQUa94fkqZdoL9LTWCoT5gF54zVsJk"
      connection={connection}
    >
      <App />
    </ParserProvider>
  )
}

export default Wrapper
