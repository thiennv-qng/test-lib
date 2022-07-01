import { utils, web3 } from '@project-serum/anchor'
import { KeypairMeta } from 'providers/parser.provider'
import Button from '../ui/button'

const SYSTEM_ACCOUNTS = [
  { name: 'systemProgram', value: web3.SystemProgram.programId },
  { name: 'rent', value: web3.SYSVAR_RENT_PUBKEY },
  { name: 'tokenProgram', value: utils.token.TOKEN_PROGRAM_ID },
  { name: 'associatedTokenProgram', value: utils.token.ASSOCIATED_PROGRAM_ID },
]

const SystemAccount = ({
  onChange,
}: {
  onChange: (val: KeypairMeta) => void
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {SYSTEM_ACCOUNTS.map((account, idx) => (
        <div key={idx}>
          <Button
            type="primary"
            onClick={() => onChange({ publicKey: account.value.toBase58() })}
            block
          >
            {account.name}
          </Button>
        </div>
      ))}
    </div>
  )
}

export default SystemAccount
