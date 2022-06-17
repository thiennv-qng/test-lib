import { useCallback, useState } from 'react'
import { PublicKeyInput, ParamInput, Empty, Segmented } from '../components'
import { useParser } from '../providers/parser.provider'
import { AddressCategory } from '../constants'
import Typography from 'components/typography'
import RemainingInput from 'components/remainingInput'

enum Tabs {
  Accounts = 'accounts',
  Arguments = 'arguments',
}

export const InstructorAccounts = () => {
  const { parser } = useParser()
  const { accountsMeta, instructionIdl, idl } = parser || {}
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
    <div className="grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-4">
        <Typography className="font-bold text-[18px]">Accounts</Typography>
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
  const { instructionIdl, argsMeta, instructionSelected } = parser || {}

  if (!instructionIdl?.args.length) return <Empty />

  return (
    <div className="flex flex-col gap-4">
      {instructionIdl.args.map(({ name, type }, idx) => (
        <ParamInput
          idlType={type}
          onChange={(val) =>
            setArgsMeta({
              instructName: instructionSelected || '',
              name,
              val,
            })
          }
          name={name}
          value={argsMeta?.[instructionSelected || '']?.[name]}
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
