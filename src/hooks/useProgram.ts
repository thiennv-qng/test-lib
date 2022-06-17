import { Idl, Program } from '@project-serum/anchor'

import { useParser } from 'providers/parser.provider'
import { useProvider } from './useProvider'

const DEFAULT_IDL: Idl = {
  version: '0',
  name: 'DEFAULT_IDL',
  instructions: [],
}
export const useProgram = () => {
  const provider = useProvider()
  const { idl = DEFAULT_IDL, programAddress = '' } = useParser().parser
  return new Program(idl, programAddress, provider)
}
