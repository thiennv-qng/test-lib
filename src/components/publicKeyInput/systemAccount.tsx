import { utils, web3 } from '@project-serum/anchor'
import { account } from '@senswap/sen-js'
import { KeypairMeta, useParser } from 'providers/parser.provider'
import Button from '../ui/button'

export const SYSTEM_ACCOUNTS = [
  { name: 'systemProgram', value: web3.SystemProgram.programId },
  { name: 'rent', value: web3.SYSVAR_RENT_PUBKEY },
  { name: 'tokenProgram', value: utils.token.TOKEN_PROGRAM_ID },
  { name: 'associatedTokenProgram', value: utils.token.ASSOCIATED_PROGRAM_ID },
  { name: 'sysvarClockProgram', value: web3.SYSVAR_CLOCK_PUBKEY },
]

const SystemAccount = ({
  onChange,
}: {
  onChange: (val: KeypairMeta) => void
}) => {
  const { programAddresses } = useParser()
  const { provider: providerProgramAddr } = programAddresses

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Program address */}
      {account.isAddress(providerProgramAddr) && (
        <div>
          <Button
            type="primary"
            onClick={() => onChange({ publicKey: providerProgramAddr })}
            block
          >
            Program Address
          </Button>
        </div>
      )}
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
