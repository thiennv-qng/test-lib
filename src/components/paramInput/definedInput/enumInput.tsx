import { IdlTypeDefTyEnum } from '@project-serum/anchor/dist/cjs/idl'

import Select from 'components/select'
import { useCallback, useEffect } from 'react'

const EnumInput = ({
  enumType,
  onChange,
}: {
  enumType: IdlTypeDefTyEnum
  onChange: (val: string) => void
}) => {
  const onDefaultValue = useCallback(() => {
    if (!enumType.variants.length) onChange(enumType.variants[0].name)
  }, [enumType.variants, onChange])

  // Select the
  useEffect(() => {
    onDefaultValue()
  }, [onDefaultValue])

  return (
    <Select
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
