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
import { IdlInstruction } from '@project-serum/anchor/dist/cjs/idl'
import { Connection } from '@solana/web3.js'

import { IdlParser } from '../helpers'

const Context = createContext<ParserProvider>({} as ParserProvider)

export type SystemSelected = 'context' | 'system' | 'idl' | 'token' | 'pda'

export type TransactionInstruction = web3.TransactionInstruction
export type SetExportTxInstruction = {
  name: string
  data: TransactionInstruction
}

export type AccountsMeta = {
  publicKey: string
  privateKey?: string
}
export type ArgsMeta = Record<string, string>
export type AccountMetaState = Record<string, AccountsMeta>
export type ArgsMetaState = Record<string, ArgsMeta>
export type IDLParserState = {
  programAddress?: string
  instructionSelected?: string
  instructionIdl?: IdlInstruction
  idl?: Idl
  argsMeta: ArgsMetaState
  accountsMeta: AccountMetaState
}
export type SetArgsMetaState = {
  instructName: string
  name: string
  val: string
}
export type SetAccountsMetaState = { name: string; data: AccountsMeta }
export type ParserProvider = {
  parser: IDLParserState
  setInstruction: (instruc: string) => void
  uploadIdl: (idl: Idl) => void
  setArgsMeta: (args: SetArgsMetaState) => void
  setAccountsMeta: (args: SetAccountsMetaState) => void
  removeIdl: () => void
  setTxInstructions: (args?: SetExportTxInstruction) => void
  connection: Connection
  walletAddress?: string
  txInstructions?: Record<string, TransactionInstruction>
}

const DEFAULT_IDL = {
  programAddress: '',
  instructionSelected: '',
  instructionIdl: undefined,
  idl: undefined,
  argsMeta: {},
  accountsMeta: {},
}

type IDLContextProviderProps = {
  children: ReactNode
  connection: Connection
  walletAddress?: string
}

const IDLParserContextProvider = ({
  children,
  connection,
  walletAddress,
}: IDLContextProviderProps) => {
  const [parserData, setParserData] = useState<IDLParserState>(
    DEFAULT_IDL as IDLParserState,
  )
  const [txInstruct, setTxInstruct] = useState({})

  const uploadIdl = useCallback(
    (idl: Idl) => {
      const nextData: IDLParserState = JSON.parse(JSON.stringify(parserData))
      const programAddress = IdlParser.getProgramAddress(idl)
      nextData.idl = idl
      nextData.programAddress = programAddress
      return setParserData({ ...nextData })
    },
    [parserData],
  )
  const removeIdl = useCallback(() => {
    setParserData(DEFAULT_IDL)
    setTxInstruct({})
  }, [])

  const setInstruction = useCallback(
    (instruction: string | undefined) => {
      const nextData: IDLParserState = JSON.parse(JSON.stringify(parserData))
      if (nextData.instructionSelected === instruction) return

      const instructionIdl = parserData.idl?.instructions?.find(
        (elm) => elm.name === instruction,
      )
      nextData.instructionIdl = instructionIdl
      nextData.instructionSelected = instruction
      return setParserData({ ...nextData })
    },
    [parserData],
  )

  const setArgsMeta = useCallback(
    (args: SetArgsMetaState | undefined) => {
      let nextData: IDLParserState = JSON.parse(JSON.stringify(parserData))
      if (!!args && !!args.instructName) {
        const { instructName, name, val } = args
        const argsData = nextData.argsMeta
        nextData.argsMeta = {
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
        nextData.accountsMeta = { ...nextData.accountsMeta, [name]: data }
      }
      return setParserData({ ...nextData })
    },
    [parserData],
  )

  const setTxInstructions = useCallback(
    (args?: SetExportTxInstruction) => {
      let nextData: Record<string, TransactionInstruction> = JSON.parse(
        JSON.stringify(txInstruct),
      )
      if (!!args) {
        const { name, data } = args
        nextData[name] = data
      }
      return setTxInstruct({ ...nextData })
    },
    [txInstruct],
  )

  const provider = useMemo(
    () => ({
      parser: parserData,
      setInstruction,
      uploadIdl,
      setArgsMeta,
      setAccountsMeta,
      removeIdl,
      setTxInstructions,
      txInstructions: txInstruct,
      connection,
      walletAddress,
    }),
    [
      parserData,
      setInstruction,
      uploadIdl,
      setArgsMeta,
      setAccountsMeta,
      removeIdl,
      setTxInstructions,
      txInstruct,
      connection,
      walletAddress,
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
