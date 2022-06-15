import App from 'App'
import ParserProvider from './providers/parser.provider'

const Wrapper = () => {
  return (
    <ParserProvider
      walletAddress="BkLRcJucoTF9GnxQUa94fkqZdoL9LTWCoT5gF54zVsJk"
      connection="https://api.devnet.solana.com"
    >
      <App />
    </ParserProvider>
  )
}

export default Wrapper
