import { useCallback, useEffect } from 'react'
import { IdlTypeDefTyEnum } from '@project-serum/anchor/dist/cjs/idl'

import Select from 'components/select'

const EnumInput = ({
  value = '',
  enumType,
  onChange,
}: {
  value?: string
  enumType: IdlTypeDefTyEnum
  onChange: (val: string) => void
}) => {
  const onDefaultValue = useCallback(() => {
    if (value === undefined || value === '') onChange(enumType.variants[0].name)
  }, [enumType.variants, onChange, value])

  // Select default enum type
  useEffect(() => {
    onDefaultValue()
  }, [onDefaultValue])

  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-[8px]"
    >
      {enumType.variants?.map((variant, idx) => {
        return (
          <option value={variant.name} key={variant.name + idx}>
            {variant.name}
          </option>
        )
      })}
    </Select>
  )
}
export default EnumInput
