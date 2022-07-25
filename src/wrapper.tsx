import App from 'App'
import ParserProvider from './providers/parser.provider'

const Wrapper = () => {
  return (
    <ParserProvider
      walletAddress="BkLRcJucoTF9GnxQUa94fkqZdoL9LTWCoT5gF54zVsJk"
      connection="https://devnet.genesysgo.net"
      programAddresses={{
        provider: 'Hxzy3cvdPz48RodavEN4P41TZp4g6Vd1kEMaUiZMof1u',
      }}
    >
      <App />
    </ParserProvider>
  )
}

export default Wrapper
