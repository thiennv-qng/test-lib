import { useCallback, useEffect, useState } from 'react'
import { web3 } from '@project-serum/anchor'
import { account } from '@senswap/sen-js'

import { Button, Typography } from 'components'
import PubicKeyInput from './index'
import Input from 'components/ui/input'

import { KeypairMeta, useParser } from 'providers/parser.provider'
import { useProgramAddress } from 'hooks/useProgramAddress'

const RECENT_PDA_OTHER = 'PDA-others'

const Pda = ({ onChange }: { onChange: (val: KeypairMeta) => void }) => {
  const [seeds, setSeeds] = useState<string[]>([''])
  const [programAddress, setProgramAddress] = useState('')
  const [pdaAddress, setPdaAddress] = useState('')
  const { setRecents } = useParser()
  const systemProgramAddr = useProgramAddress()

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
    if (!seeds.length || !account.isAddress(programAddress))
      return setPdaAddress('')
    const [pdaAddress] = await web3.PublicKey.findProgramAddress(
      seeds.map((val) => {
        if (account.isAddress(val)) return new web3.PublicKey(val).toBuffer()
        return Buffer.from(val)
      }),
      new web3.PublicKey(programAddress),
    )
    setPdaAddress(pdaAddress.toBase58())
  }, [programAddress, seeds])

  const onDone = useCallback(() => {
    if (!account.isAddress(pdaAddress)) return
    onChange({ publicKey: pdaAddress })
    for (const seed of seeds) {
      if (!seed) continue
      console.log(seed, 'seed')
      setRecents({ name: RECENT_PDA_OTHER, value: seed })
    }
  }, [onChange, pdaAddress, seeds, setRecents])

  useEffect(() => {
    deriveNewPDAAddress()
  }, [deriveNewPDAAddress])

  // set systemProgramAddress to default program address
  useEffect(() => {
    setProgramAddress(systemProgramAddr)
  }, [systemProgramAddr])

  return (
    <div className="flex flex-col gap-8">
      <Button type="dashed" onClick={() => onAdd()}>
        Add
      </Button>

      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-4">
          {/* PDA seeds account */}
          {seeds.map((val, idx) => {
            return (
              <PubicKeyInput
                value={val}
                accountName={'Seed ' + (idx + 1)}
                onChange={(val) => onChangeInput(idx, val.publicKey)}
                onRemove={() => onRemove(idx)}
                key={idx}
              />
            )
          })}
        </div>

        {/* Custom program address */}
        <div className="grid grid-cols-1 gap-2">
          <Typography secondary>Program address</Typography>
          <Input
            bordered={false}
            value={programAddress}
            onChange={(e) => setProgramAddress(e.target.value)}
          />
        </div>

        {/* PDA result */}
        {pdaAddress && (
          <div className="grid grid-cols-1 gap-2 p-4 rounded-md shadow-[0_0_15px_#d6d6d6]">
            <Typography secondary>PDA Address</Typography>
            <Typography>{pdaAddress}</Typography>
          </div>
        )}
        {!!seeds.length && (
          <Button type="primary" onClick={onDone} disabled={!pdaAddress} block>
            Done
          </Button>
        )}
      </div>
    </div>
  )
}

export default Pda
