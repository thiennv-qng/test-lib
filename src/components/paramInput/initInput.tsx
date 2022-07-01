import ArrayInput from './wrapInput/arrayInput'
import DefinedInput from './definedInput'

import { useParser } from 'providers/parser.provider'

type InitInputProps = {
  idlType: any
  inputName: string
  value?: string
  onChange: (value: string) => void
}
const InitInput = ({
  value = '',
  inputName,
  idlType,
  onChange,
}: InitInputProps) => {
  const { parser } = useParser()
  if (!parser?.idl?.accounts) return null

  const vecType = idlType['vec']
  const arrayType = idlType['array']
  const definedType = idlType['defined']

  if (!!vecType) return <ArrayInput idlType={vecType} onChange={onChange} />
  if (!!arrayType) {
    if (Array.isArray(!!arrayType)) {
      return <ArrayInput idlType={arrayType[0]} onChange={onChange} />
    }
    return <ArrayInput idlType={arrayType} onChange={onChange} />
  }

  if (!!definedType) {
    return (
      <InitInput
        value={value}
        idlType={definedType}
        inputName={inputName}
        onChange={onChange}
      />
    )
  }

  return <DefinedInput name={idlType} value={value} onChange={onChange} />
}

export default InitInput
