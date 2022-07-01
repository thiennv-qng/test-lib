import { Idl, Program, web3 } from '@project-serum/anchor'

import { useParser } from 'providers/parser.provider'
import { useMemo } from 'react'
import { useProvider } from './useProvider'

const DEFAULT_IDL: Idl = {
  version: '0',
  name: 'DEFAULT_IDL',
  instructions: [],
}
const DEFAULT_IDL_PROGRAM_ADDRESS = web3.Keypair.generate().publicKey

export const useProgram = () => {
  const provider = useProvider()
  const { parser, programAddress } = useParser()
  const { idl = DEFAULT_IDL } = parser

  let paramProgramAddr = !!programAddress
    ? programAddress
    : DEFAULT_IDL_PROGRAM_ADDRESS

  return useMemo(
    () => new Program(idl, paramProgramAddr, provider),
    [idl, paramProgramAddr, provider],
  )
}
