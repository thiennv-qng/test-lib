import { useState } from 'react'

import Empty from '../components/empty'
import ParamInput from '../components/paramInput'
import { useParser } from '../providers/parser.provider'
import PublicKeyInput from '../components/publicKeyInput'
import Segmented from 'components/segmented'

export const InstructorAccounts = () => {
  const {
    parser: { accountsMeta, instructionIdl },
    setAccountsMeta,
  } = useParser()

  if (!instructionIdl?.accounts.length) return <Empty />
  return (
    <div className="flex flex-col gap-4">
      {instructionIdl.accounts.map((account, idx) => (
        <PublicKeyInput
          onChange={(accData) =>
            setAccountsMeta({ name: account.name, data: accData })
          }
          name={account.name}
          value={accountsMeta[account.name]?.publicKey}
          key={idx}
        />
      ))}
    </div>
  )
}

export const InstructorArguments = () => {
  const {
    parser: { instructionIdl, argsMeta },
    setArgsMeta,
  } = useParser()
  if (!instructionIdl?.args.length) return <Empty />

  return (
    <div className="flex flex-col gap-4">
      {instructionIdl.args.map(({ name, type }, idx) => (
        <ParamInput
          idlType={type}
          onChange={(val) => setArgsMeta({ name, val })}
          name={name}
          value={argsMeta[name]}
          key={idx}
        />
      ))}
    </div>
  )
}
type InstrucSegmentedType = 'accounts' | 'arguments'

const INSTRUCTIONS = {
  accounts: <InstructorAccounts />,
  arguments: <InstructorArguments />,
}

const TAB_INSTRUCS = ['accounts', 'arguments']

const InstructionView = () => {
  const [selected, setSelected] = useState('accounts')
  const {
    parser: { idl },
  } = useParser()

  if (!idl) return <Empty />
  return (
    <div className="flex flex-col gap-5">
      <div>
        <Segmented
          value={selected}
          options={TAB_INSTRUCS}
          onChange={setSelected}
        />
      </div>
      <div>{INSTRUCTIONS[selected as InstrucSegmentedType]}</div>
    </div>
  )
}

export default InstructionView
