import {
  IdlTypeDefTyEnum,
  IdlTypeDefTyStruct,
} from '@project-serum/anchor/dist/cjs/idl'

import { Typography } from 'components'
import EnumInput from './enumInput'
import StructInput from './structInput'

import { useParser } from 'providers/parser.provider'

const DefinedInput = ({
  value,
  name,
  onChange,
}: {
  value?: string
  name: string
  onChange: (val: string) => void
}) => {
  const { parser } = useParser()

  let typeIdlEnum = parser.idl?.types?.find((e) => e.name === name)
  if (!typeIdlEnum)
    typeIdlEnum = parser.idl?.accounts?.find((e) => e.name === name)

  if (typeIdlEnum?.type.kind === 'enum') {
    const enumType = typeIdlEnum.type as IdlTypeDefTyEnum
    return <EnumInput enumType={enumType} value={value} onChange={onChange} />
  }

  if (typeIdlEnum?.type.kind === 'struct') {
    const enumType = typeIdlEnum.type as IdlTypeDefTyStruct
    return <StructInput structType={enumType} onChange={onChange} />
  }

  return (
    <div className="rounded-[4px] bg-[#E0E0E0] p-2 cursor-not-allowed">
      <Typography className="text-red-600">Error</Typography>
    </div>
  )
}

export default DefinedInput
