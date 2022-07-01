import { useCallback, useEffect, useState } from 'react'
import { web3 } from '@project-serum/anchor'
import { account } from '@senswap/sen-js'

import { Button, Typography } from 'components'
import PubicKeyInput from './index'

import { useParser } from 'providers/parser.provider'

const Pda = ({ onChange }: { onChange: (val: string) => void }) => {
  const [seeds, setSeeds] = useState<string[]>([])
  const [pdaAddress, setPdaAddress] = useState('')
  const { programAddress } = useParser()

  const onAdd = () => {
    const newSeed = [...seeds]
    newSeed.push('')
    setSeeds(newSeed)
  }
  const onRemove = (index: number) => {
    const newSeed = [...seeds]
    newSeed.splice(index, 1)
    setSeeds(newSeed)
  }

  const onChangeInput = async (idx: number, val: string) => {
    const newSeed = [...seeds]
    newSeed[idx] = val
    setSeeds(newSeed)
  }

  const deriveNewPDAAddress = useCallback(async () => {
    if (!seeds.length || !programAddress) return setPdaAddress('')
    const [pdaAddress] = await web3.PublicKey.findProgramAddress(
      seeds.map((val) => {
        if (account.isAddress(val)) return new web3.PublicKey(val).toBuffer()
        return Buffer.from(val)
      }),
      new web3.PublicKey(programAddress || ''),
    )
    setPdaAddress(pdaAddress.toBase58())
  }, [programAddress, seeds])

  useEffect(() => {
    deriveNewPDAAddress()
  }, [deriveNewPDAAddress])

  return (
    <div className="flex flex-col gap-8">
      <Button type="dashed" onClick={() => onAdd()}>
        Add
      </Button>

      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-4">
          {seeds.map((val, idx) => {
            return (
              <PubicKeyInput
                value={val}
                name={'Seed ' + (idx + 1)}
                onChange={(val) => onChangeInput(idx, val.publicKey)}
                onRemove={() => onRemove(idx)}
                acceptRemove
                key={idx}
              />
            )
          })}
        </div>

        {pdaAddress && <Typography>PDA Address: {pdaAddress}</Typography>}
        {!!seeds.length && (
          <Button
            type="primary"
            onClick={() => onChange(pdaAddress)}
            disabled={!pdaAddress}
            block
          >
            Done
          </Button>
        )}
      </div>
    </div>
  )
}

export default Pda
