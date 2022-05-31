import { useState } from 'react'
import { IdlTypeDefTyStruct } from '@project-serum/anchor/dist/cjs/idl'

import ParamInput from '../index'
import Button from '../../button'

const StructInput = ({
  structType,
  onChange,
}: {
  structType: IdlTypeDefTyStruct
  onChange: (val: string) => void
}) => {
  const [structData, setStructData] = useState<Record<string, string>>({})

  const onChangeStruct = (key: string, val: string) => {
    const newData = { ...structData }
    newData[key] = val
    setStructData(newData)
  }

  return (
    <div className="flex flex-col gap-6">
      {structType.fields?.map(({ name, type }) => {
        return (
          <ParamInput
            name={name}
            idlType={type}
            value={structData[name] || ''}
            onChange={(data) => onChangeStruct(name, data)}
          />
        )
      })}
      <Button onClick={() => onChange(JSON.stringify(structData))} block>
        Done
      </Button>
    </div>
  )
}
export default StructInput
