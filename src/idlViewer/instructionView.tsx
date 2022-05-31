import { useCallback, useState } from 'react'
import { PublicKeyInput, ParamInput, Empty, Segmented } from '../components'
import { useParser } from '../providers/parser.provider'
import { AddressCategory } from '../constants'

enum Tabs {
  Accounts = 'accounts',
  Arguments = 'arguments',
}

export const InstructorAccounts = () => {
  const { accountsMeta, instructionIdl, idl } = useParser().parser
  const setAccountsMeta = useParser().setAccountsMeta

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
          defaultCategory={findDefaultCategory(account.name)}
        />
      ))}
    </div>
  )
}

export const InstructorArguments = () => {
  const { parser, setArgsMeta } = useParser()
  const { instructionIdl, argsMeta } = parser || {}

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
