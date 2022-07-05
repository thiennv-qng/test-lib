import { Fragment, useCallback, useState } from 'react'

import {
  PublicKeyInput,
  ParamInput,
  Empty,
  Segmented,
  Typography,
} from '../components'
import RemainingInput from 'components/remainingInput'

import { useParser } from '../providers/parser.provider'
import { useIdlInstruction } from 'hooks/useIdlInstruction'

enum Tabs {
  Accounts = 'accounts',
  Arguments = 'arguments',
}

export const InstructorAccounts = () => {
  const { parser, setAccountsMeta } = useParser()
  const { accountsMetas: accountsMeta, ixSelected } = parser || {}
  const idlInstruction = useIdlInstruction(ixSelected)

  if (!idlInstruction?.accounts.length)
    return <Empty className="relative top-[50%] translate-y-[-50%]" />
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-4">
        <Typography className="font-bold text-[18px]">Accounts</Typography>
        {idlInstruction.accounts.map((account, idx) => (
          <PublicKeyInput
            onChange={(accData) =>
              setAccountsMeta({ name: account.name, data: accData })
            }
            accountName={account.name}
            value={accountsMeta[account.name]?.publicKey}
            key={idx}
          />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <Typography className="font-bold text-[18px]" level={4}>
          Remaining Accounts
        </Typography>
        <RemainingInput />
      </div>
    </div>
  )
}

export const InstructorArguments = () => {
  const { parser, setArgsMeta } = useParser()
  const { argsMetas, ixSelected } = parser || {}
  const idlInstruction = useIdlInstruction(ixSelected)

  const onChange = useCallback(
    (name: string, val: string) => {
      return setArgsMeta({
        instructName: ixSelected,
        name,
        val,
      })
    },
    [ixSelected, setArgsMeta],
  )

  if (!idlInstruction?.args.length)
    return <Empty className="relative top-[50%] translate-y-[-50%]" />
  return (
    <div className="flex flex-col gap-4">
      {idlInstruction.args.map(({ name, type }, idx) => (
        <ParamInput
          idlType={type}
          onChange={(val) => onChange(name, val)}
          name={name}
          value={argsMetas[ixSelected]?.[name]}
          key={idx}
        />
      ))}
    </div>
  )
}

type InstructionContentProps = { selected: string }
const InstructionContent = ({ selected }: InstructionContentProps) => {
  const { parser } = useParser()
  const { idl } = parser || {}

  if (!idl) return <Empty className="relative top-[50%] translate-y-[-50%]" />

  return (
    <Fragment>
      {selected === Tabs.Accounts && <InstructorAccounts />}
      {selected === Tabs.Arguments && <InstructorArguments />}
    </Fragment>
  )
}

const InstructionView = () => {
  const [selected, setSelected] = useState('accounts')

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col items-center">
        <Segmented
          value={selected}
          options={[Tabs.Accounts, Tabs.Arguments]}
          onChange={setSelected}
        />
      </div>
      <div className="h-full">
        <InstructionContent selected={selected} />
      </div>
    </div>
  )
}

export default InstructionView
