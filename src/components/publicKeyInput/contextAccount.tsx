import { web3 } from '@project-serum/anchor'
import { Button, Input, Typography } from 'components'

import { KeypairMeta, useParser } from 'providers/parser.provider'

type ContextAccountProps = {
  onChange: (value: KeypairMeta) => void
}

const ContextAccount = ({ onChange }: ContextAccountProps) => {
  const { parser, walletAddress } = useParser()
  const { accountsMetas: accountsMeta } = parser || {}

  const onCreateAccount = () => {
    const keypair = web3.Keypair.generate()
    onChange({
      publicKey: keypair.publicKey.toBase58(),
      privateKey: Buffer.from(keypair.secretKey).toString('hex'),
    })
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {walletAddress && (
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => onChange({ publicKey: walletAddress })}
            block
            disabled={!walletAddress}
          >
            Wallet Address
          </Button>
          <Button type="primary" onClick={onCreateAccount} block>
            New Keypair
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {Object.keys(accountsMeta).map((key, idx) => {
          const val = accountsMeta?.[key].publicKey
          return (
            <div className="grid grid-cols-1 gap-1" key={idx}>
              <Typography secondary>{key}</Typography>
              <div className="flex flex-row gap-4">
                <Input
                  className="flex-auto"
                  value={val}
                  onChange={() => {}}
                  bordered={false}
                />
                <Button
                  type="text"
                  className="font-bold"
                  onClick={() => onChange({ publicKey: val })}
                >
                  Select
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ContextAccount
