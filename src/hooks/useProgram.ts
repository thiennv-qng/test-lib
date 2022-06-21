import { Idl, Program } from '@project-serum/anchor'

import { useParser } from 'providers/parser.provider'
import { useMemo } from 'react'
import { useProvider } from './useProvider'

const DEFAULT_IDL: Idl = {
  version: '0',
  name: 'DEFAULT_IDL',
  instructions: [],
}
const DEFAULT_IDL_PROGRAM_ADDRESS =
  'Hxzy3cvdPz48RodavEN4P41TZp4g6Vd1kEMaUiZMof1u'

export const useProgram = () => {
  const provider = useProvider()
  const { parser } = useParser()
  const { idl = DEFAULT_IDL, programAddress } = parser

  let paramProgramAddr = !!programAddress
    ? programAddress
    : DEFAULT_IDL_PROGRAM_ADDRESS

  return useMemo(
    () => new Program(idl, paramProgramAddr, provider),
    [idl, paramProgramAddr, provider],
  )
}
