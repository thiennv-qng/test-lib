import { useCallback, useState } from 'react'
import { PublicKeyInput, ParamInput, Empty, Segmented } from '../components'
import { useParser } from '../providers/parser.provider'
import { AddressCategory } from '../types'
import Typography from 'components/typography'
import RemainingInput from 'components/remainingInput'
import { useIdlInstruction } from 'hooks/useIdlInstruction'

enum Tabs {
  Accounts = 'accounts',
  Arguments = 'arguments',
}

export const InstructorAccounts = () => {
  const { parser, setAccountsMeta } = useParser()
  const { accountsMetas: accountsMeta, idl, ixSelected } = parser || {}
  const idlInstruction = useIdlInstruction(ixSelected)

  const findDefaultCategory = useCallback(
    (accountName: string) => {
      if (!idl) return
      const name = accountName.toLowerCase()
      // Check IDL accounts type
      if (idl.accounts) {
        for (const accountType of idl.accounts) {
          for (const field of accountType.type.fields) {
            if (name.includes(field.name.toLowerCase()))
              return AddressCategory.idl
          }
        }
      }
      if (name.includes('program')) return AddressCategory.system
      if (name.includes('tokenaccount') || name.includes('associated'))
        return AddressCategory.token
      return AddressCategory.system
    },
    [idl],
  )

  if (!idlInstruction?.accounts.length) return <Empty />
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-4">
        <Typography className="font-bold text-[18px]">Accounts</Typography>
        {idlInstruction.accounts.map((account, idx) => (
          <PublicKeyInput
            onChange={(accData) =>
              setAccountsMeta({ name: account.name, data: accData })
            }
            name={account.name}
            value={accountsMeta[account.name]?.publicKey}
            key={idx}
            defaultCategory={findDefaultCategory(account.name)}
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

  if (!idlInstruction?.args.length) return <Empty />
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

const InstructionView = () => {
  const [selected, setSelected] = useState('accounts')
  const { parser } = useParser()
  const { idl } = parser || {}

  if (!idl) return <Empty />
  return (
    <div className="flex flex-col gap-5">
      <div>
        <Segmented
          value={selected}
          options={[Tabs.Accounts, Tabs.Arguments]}
          onChange={setSelected}
        />
      </div>
      <div>
        {selected === Tabs.Accounts && <InstructorAccounts />}
        {selected === Tabs.Arguments && <InstructorArguments />}
      </div>
    </div>
  )
}

export default InstructionView
