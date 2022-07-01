import { useCallback, useState } from 'react'
import { IdlTypeDefTyStruct } from '@project-serum/anchor/dist/cjs/idl'

import ParamInput from '../wrapInput/index'

const StructInput = ({
  structType,
  onChange,
}: {
  structType: IdlTypeDefTyStruct
  onChange: (val: string) => void
}) => {
  const [structData, setStructData] = useState<Record<string, string>>({})

  const onChangeStruct = useCallback(
    (key: string, val: string) => {
      const newData = { ...structData }
      newData[key] = val
      setStructData(newData)

      return onChange(JSON.stringify(newData))
    },
    [onChange, structData],
  )

  return (
    <div className="flex flex-col w-full p-4 gap-2 rounded-[4px] shadow-[0_0_8px_#181c3630]">
      {structType.fields?.map(({ name, type }, idx) => {
        return (
          <ParamInput
            idlType={type}
            value={structData[name] || ''}
            onChange={(data) => onChangeStruct(name, data)}
            key={idx}
          />
        )
      })}
    </div>
  )
}
export default StructInput
