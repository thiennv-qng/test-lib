import {
  IdlTypeDefTyEnum,
  IdlTypeDefTyStruct,
} from '@project-serum/anchor/dist/cjs/idl'
import Typography from 'components/typography'
import { useParser } from '../../../providers/parser.provider'

import EnumInput from './enumInput'
import StructInput from './structInput'

const DefinedInput = ({
  name,
  onChange,
}: {
  name: string
  onChange: (val: string) => void
}) => {
  const { parser } = useParser()

  let typeIdlEnum = parser.idl?.types?.find((e) => e.name === name)
  if (!typeIdlEnum)
    typeIdlEnum = parser.idl?.accounts?.find((e) => e.name === name)

  if (typeIdlEnum?.type.kind === 'enum') {
    const enumType = typeIdlEnum.type as IdlTypeDefTyEnum
    return <EnumInput enumType={enumType} onChange={onChange} />
  }

  if (typeIdlEnum?.type.kind === 'struct') {
    const enumType = typeIdlEnum.type as IdlTypeDefTyStruct
    return <StructInput structType={enumType} onChange={onChange} />
  }

  return (
    <div className="border rounded-[8px] background-[#e0e0e0] p-[8px]">
      <Typography className="text-red-600">Error</Typography>
    </div>
  )
}

export default DefinedInput
