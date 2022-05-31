import { IdlTypeDefTyEnum } from '@project-serum/anchor/dist/cjs/idl'

import Button from '../../button'
import Input from '../../input'

const EnumInput = ({
  enumType,
  onChange,
}: {
  enumType: IdlTypeDefTyEnum
  onChange: (val: string) => void
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {enumType.variants?.map((variant) => {
        return (
          <div className="flex flex-row gap-4" key={variant.name}>
            <Input
              className="flex-auto"
              value={variant.name}
              onValue={() => {}}
              bordered={false}
            />
            <Button onClick={() => onChange(variant.name)}>Select</Button>
          </div>
        )
      })}
    </div>
  )
}
export default EnumInput
