import { useMemo } from 'react'
import { IdlInstruction } from '@project-serum/anchor/dist/cjs/idl'
import { useParser } from 'providers/parser.provider'

const IDL_INSTRUCTION_DEFAULT: IdlInstruction = {
  name: 'DEFAULT',
  accounts: [],
  args: [],
}
export const useIdlInstruction = (ixName?: string): IdlInstruction => {
  const { idl } = useParser().parser

  const idlInstruction = useMemo(
    () => idl?.instructions?.find((elm) => elm.name === ixName),
    [idl?.instructions, ixName],
  )

  return idlInstruction || IDL_INSTRUCTION_DEFAULT
}
