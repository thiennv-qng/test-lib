import { web3 } from '@project-serum/anchor'

import { Button, Empty, Input, Typography } from 'components'

import { useParser } from '../../providers/parser.provider'

const ContextAccount = ({ onClick }: { onClick: (val: string) => void }) => {
  const { parser, walletAddress } = useParser()
  const { accountsMetas: accountsMeta } = parser || {}

  const onNewKeypair = () => {
    const newKeypair = web3.Keypair.generate()
    onClick(
      newKeypair.publicKey.toBase58(),
      // privateKey: Buffer.from(newKeypair.secretKey).toString('hex'),
    )
  }

  return (
    <div>
      <div>
        <Button
          onClick={() => onClick(walletAddress || '')}
          block
          disabled={!walletAddress}
        >
          Wallet Address
        </Button>
      </div>
      <div>
        <Button type="primary" onClick={onNewKeypair} block>
          New Keypair
        </Button>
      </div>
      {!Object.keys(accountsMeta).length ? (
        <Empty />
      ) : (
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
                    onClick={() => onClick(val)}
                  >
                    Select
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ContextAccount
