import { ChangeEvent, useEffect, useState } from 'react'
import IonIcon from '@sentre/antd-ionicon'

import Button from 'components/button'
import Typography from 'components/typography'
import Input from 'components/input'
import Switch from 'components/switch'

import { RemainingAccounts, useParser } from 'providers/parser.provider'

const DEFAULT_REMAINING_ACCOUNT = {
  isSigner: false,
  isWritable: true,
  pubkey: '',
}

const RemainingInput = () => {
  const { setRemainingAccouts, parser } = useParser()
  const { remainingAccounts, instructionSelected } = parser || {}
  const [seeds, setSeeds] = useState<RemainingAccounts[]>([])

  const onAdd = () => {
    const newSeed = [...seeds]
    newSeed.push(DEFAULT_REMAINING_ACCOUNT)
    setSeeds(newSeed)
    if (!instructionSelected) return

    const nextRemainingAcounts = remainingAccounts[instructionSelected] || []
    nextRemainingAcounts.push(DEFAULT_REMAINING_ACCOUNT)

    return setRemainingAccouts({
      name: instructionSelected,
      data: nextRemainingAcounts,
    })
  }
  const onRemove = (index: number) => {
    const newSeed = [...seeds]
    newSeed.splice(index, 1)
    setSeeds(newSeed)

    if (!instructionSelected) return

    const nextRemainingAcounts = remainingAccounts[instructionSelected] || []
    nextRemainingAcounts.splice(index, 1)

    return setRemainingAccouts({
      name: instructionSelected,
      data: nextRemainingAcounts,
    })
  }

  const handleChangeRemainingAccount = (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (!instructionSelected) return

    const elmName = event.target.name
    const ipType = event.target.type
    const value =
      ipType === 'checkbox' ? event.target.checked : event.target.value

    const nextRemainingAcounts = JSON.parse(JSON.stringify(remainingAccounts))
    const nextRemainingData = nextRemainingAcounts[instructionSelected] || []

    const indexData = nextRemainingData[index]
    if (!!indexData) {
      indexData[elmName] = value
      nextRemainingData[index] = indexData
    } else {
      const newRemainingData = {
        ...DEFAULT_REMAINING_ACCOUNT,
        [elmName]: value,
      }
      nextRemainingData.push(newRemainingData)
    }
    setRemainingAccouts({
      name: instructionSelected,
      data: nextRemainingData,
    })
  }

  useEffect(() => {
    if (
      !!instructionSelected &&
      !!remainingAccounts[instructionSelected]?.length
    )
      setSeeds(remainingAccounts[instructionSelected])
    return () => setSeeds([])
  }, [instructionSelected, remainingAccounts])

  return (
    <div className="flex flex-col gap-8">
      <Button
        suffix={<IonIcon name="add-outline" />}
        type="dashed"
        onClick={() => onAdd()}
      >
        Add
      </Button>

      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-4">
          {seeds.map((_, idx) => {
            const listData = remainingAccounts[instructionSelected || '']
            const data = listData?.[idx] || {}

            return (
              <div
                className="grid grid-cols-1 gap-3 p-4 shadow-[0_0_16px_#dedede] rounded-md"
                key={idx}
              >
                {/* Remaining account title*/}
                <div className="flex flex-row justify-between">
                  <Typography>{`Account ${idx + 1}`}</Typography>
                  <Button
                    type="text"
                    suffix={<IonIcon name="trash-outline" />}
                    onClick={() => onRemove(idx)}
                  />
                </div>

                {/* Remaining account input */}
                <div className="grid grid-cols-1 gap-2">
                  {/* Is Signer */}
                  <div className="flex flex-row flex-nowrap justify-between  gap-2">
                    <Typography secondary>Is Signer</Typography>
                    <div className="flex flex-row flex-nowrap gap-4">
                      <Switch
                        name="isSigner"
                        checked={data.isSigner || false}
                        onChange={(e) => handleChangeRemainingAccount(e, idx)}
                      />
                    </div>
                  </div>
                  {/* Is Writable */}
                  <div className="flex flex-row flex-nowrap justify-between gap-2">
                    <Typography secondary>Is Writable</Typography>
                    <div className="flex flex-row flex-nowrap gap-4">
                      <Switch
                        name="isWritable"
                        checked={data.isWritable || false}
                        onChange={(e) => handleChangeRemainingAccount(e, idx)}
                      />
                    </div>
                  </div>

                  {/* Publicjekey */}
                  <div>
                    <Typography secondary>Publickey</Typography>
                    <Input
                      name="pubkey"
                      value={data.pubkey || ''}
                      onChange={(e) => handleChangeRemainingAccount(e, idx)}
                      bordered={false}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default RemainingInput
