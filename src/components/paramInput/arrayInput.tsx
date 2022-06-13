import { Fragment, useState } from 'react'
import { IdlType } from '@project-serum/anchor/dist/cjs/idl'

import Button from '../button'
import ParamInput from './index'

type ArrayInputProps = {
  idlType: IdlType
  onChange: (val: string) => void
  inputName?: string
}
const ArrayInput = ({
  idlType,
  onChange,
  inputName = 'Seed',
}: ArrayInputProps) => {
  const [values, setValues] = useState<string[]>([])

  const onAdd = () => {
    const newValues = [...values]
    newValues.push('')
    setValues(newValues)
  }

  const onRemove = (index: number) => {
    const newValues = [...values]
    newValues.splice(index, 1)
    setValues(newValues)
  }

  const onChangeValues = (idx: number, val: string) => {
    const newValues = [...values]
    newValues[idx] = val
    setValues(newValues)
  }

  const onOk = () => {
    const stringData = values.join(',')
    onChange(stringData)
  }

  return (
    <div className="flex flex-col gap-6">
      <Button type="dashed" onClick={() => onAdd()}>
        Add
      </Button>

      {values.map((val, idx) => {
        const name = `${inputName} ${String(idx + 1)}`
        return (
          <ParamInput
            idlType={idlType}
            name={name}
            value={val}
            onChange={(data) => onChangeValues(idx, data)}
            onRemove={() => onRemove(idx)}
            acceptRemove
            key={idx}
          />
        )
      })}
      {!!values.length && (
        <Button type="primary" onClick={() => onOk()}>
          Done
        </Button>
      )}
    </div>
  )
}

export default ArrayInput
