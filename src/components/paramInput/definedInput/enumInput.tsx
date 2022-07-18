import { useCallback, useEffect } from 'react'
import { IdlTypeDefTyEnum } from '@project-serum/anchor/dist/cjs/idl'

import Selection from 'components/ui/selection'

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
    <Selection
      options={enumType.variants?.map(({ name }) => {
        return { label: name, value: name }
      })}
      onSelected={onChange}
      selected={value}
      style={{ maxWidth: 180 }}
    />
  )
}
export default EnumInput
