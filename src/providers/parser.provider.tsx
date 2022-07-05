import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  ReactNode,
  Component,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react'
import { Idl, web3 } from '@project-serum/anchor'
import { account } from '@senswap/sen-js'

const Context = createContext<ParserProvider>({} as ParserProvider)

export type SystemSelected = 'context' | 'system' | 'idl' | 'token' | 'pda'

export type TransactionInstruction = web3.TransactionInstruction
export type SetExportTxInstruction = {
  name: string
  data: TransactionInstruction
}

export type AccountMetaAddress = {
  isSigner: boolean
  isWritable: boolean
  address: string
}
export type KeypairMeta = {
  publicKey: string
  privateKey?: string
}
export type ArgsMeta = Record<string, string>
export type AccountMetaState = Record<string, KeypairMeta>
export type ArgsMetaState = Record<string, ArgsMeta>

export type IDLParserState = {
  ixSelected: string
  idl?: Idl
  argsMetas: ArgsMetaState
  accountsMetas: AccountMetaState
  remainingAccounts: Record<string, AccountMetaAddress[]>
}
export type SetArgsMetaState = {
  instructName: string
  name: string
  val: string
}
export type ProgramAddress = {
  idl?: string
  provider: string
  customer?: string
}
export type SetAccountsMetaState = { name: string; data: KeypairMeta }
export type SetRemainingAccounts = { name: string; data: AccountMetaAddress[] }
export type ParserProvider = {
  programAddresses: ProgramAddress
  parser: IDLParserState
  setInstruction: (instruc: string) => void
  uploadIdl: (idl: Idl) => void
  setArgsMeta: (args: SetArgsMetaState) => void
  setAccountsMeta: (args: SetAccountsMetaState) => void
  removeIdl: () => void
  setTxInstructions: (args?: SetExportTxInstruction) => void
  connection: string
  walletAddress?: string
  txInstructions?: Record<string, TransactionInstruction>
  setRemainingAccouts: (args: SetRemainingAccounts) => void
  setProgramAddress: (name: string, programAddress: string) => void
}

const DEFAULT_PARSER_IDL: IDLParserState = {
  ixSelected: '',
  idl: undefined,
  argsMetas: {},
  accountsMetas: {},
  remainingAccounts: {},
}

type IDLContextProviderProps = {
  children: ReactNode
  connection: string
  walletAddress?: string
  programAddresses: ProgramAddress
}

const IDLParserContextProvider = ({
  children,
  connection,
  walletAddress,
  programAddresses,
}: IDLContextProviderProps) => {
  const [parserData, setParserData] = useState<IDLParserState>(
    DEFAULT_PARSER_IDL as IDLParserState,
  )
  const [txInstruct, setTxInstruct] = useState({})
  const [stateProgramAddresses, setStateProgramAddresses] =
    useState(programAddresses)

  const uploadIdl = useCallback(
    (idl: Idl) => {
      const nextData: IDLParserState = JSON.parse(JSON.stringify(parserData))
      nextData.idl = idl
      return setParserData({ ...nextData })
    },
    [parserData],
  )
  const removeIdl = useCallback(() => {
    setParserData(DEFAULT_PARSER_IDL)
    setTxInstruct({})
    // remove custom programAddress
    const nextData = { ...stateProgramAddresses }
    nextData.customer = ''
    setStateProgramAddresses(nextData)
  }, [stateProgramAddresses])

  const selectInstruction = useCallback(
    (ixName: string) => {
      const nextData: IDLParserState = JSON.parse(JSON.stringify(parserData))
      if (nextData.ixSelected === ixName) return
      nextData.ixSelected = ixName
      // Default instruction data
      if (
        !nextData.remainingAccounts[ixName] ||
        !nextData.remainingAccounts[ixName].length
      )
        nextData.remainingAccounts[ixName] = []
      return setParserData(nextData)
    },
    [parserData],
  )

  const setArgsMeta = useCallback(
    (args: SetArgsMetaState | undefined) => {
      let nextData: IDLParserState = JSON.parse(JSON.stringify(parserData))
      if (!!args && !!args.instructName) {
        const { instructName, name, val } = args
        const argsData = nextData.argsMetas
        nextData.argsMetas = {
          ...argsData,
          [instructName]: { ...argsData[instructName], [name]: val },
        }
      }
      return setParserData({ ...nextData })
    },
    [parserData],
  )

  const setAccountsMeta = useCallback(
    (args: SetAccountsMetaState | undefined) => {
      const nextData: IDLParserState = JSON.parse(JSON.stringify(parserData))
      if (!!args) {
        const { name, data } = args
        nextData.accountsMetas = { ...nextData.accountsMetas, [name]: data }
      }
      return setParserData({ ...nextData })
    },
    [parserData],
  )

  const setRemainingAccouts = useCallback(
    (args: SetRemainingAccounts | undefined) => {
      const nextData: IDLParserState = JSON.parse(JSON.stringify(parserData))
      if (!!args) {
        const { name, data } = args
        nextData.remainingAccounts[name] = data
      }
      return setParserData({ ...nextData })
    },
    [parserData],
  )
  const setTxInstructions = useCallback(
    (args?: SetExportTxInstruction) => {
      // Set next data = old data, not clone to avoid re-rendering unnecessary
      const nextData: Record<string, TransactionInstruction> = txInstruct
      if (!!args) {
        const { name, data } = args
        nextData[name] = data
      }
      return setTxInstruct(nextData)
    },
    [txInstruct],
  )

  const setProgramAddress = useCallback(
    (name, address) => {
      const nextData = { ...stateProgramAddresses }
      if (account.isAddress(address) && !!name) nextData[name] = address

      return setStateProgramAddresses(nextData)
    },
    [stateProgramAddresses],
  )

  const provider = useMemo(
    () => ({
      parser: parserData,
      txInstructions: txInstruct,
      connection,
      walletAddress,
      programAddresses: stateProgramAddresses,
      setInstruction: selectInstruction,
      uploadIdl,
      setArgsMeta,
      setAccountsMeta,
      removeIdl,
      setTxInstructions,
      setRemainingAccouts,
      setProgramAddress,
    }),
    [
      parserData,
      txInstruct,
      connection,
      walletAddress,
      stateProgramAddresses,
      selectInstruction,
      uploadIdl,
      setArgsMeta,
      setAccountsMeta,
      removeIdl,
      setTxInstructions,
      setRemainingAccouts,
      setProgramAddress,
    ],
  )

  return <Context.Provider value={provider}>{children}</Context.Provider>
}
export default IDLParserContextProvider

type IDLParserContextConsumerProps = { children: JSX.Element }
const IDLParserContextConsumer = ({
  children,
}: IDLParserContextConsumerProps) => {
  return (
    <Context.Consumer>
      {(value) =>
        Children.map(children, (child) => cloneElement(child, { ...value }))
      }
    </Context.Consumer>
  )
}

export const withParser = (WrappedComponent: typeof Component) => {
  class HOC extends Component<any, any> {
    render() {
      const { forwardedRef, ...rest } = this.props
      return (
        <IDLParserContextConsumer>
          <WrappedComponent ref={forwardedRef} {...rest} />
        </IDLParserContextConsumer>
      )
    }
  }
  return forwardRef<HTMLElement, any>((props, ref) => (
    <HOC {...props} ref={ref} />
  ))
}

export const useParser = () => useContext<ParserProvider>(Context)
