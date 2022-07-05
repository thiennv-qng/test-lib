import { Idl, Program, web3 } from '@project-serum/anchor'
import { account } from '@senswap/sen-js'

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
  const { parser, programAddresses } = useParser()
  const { idl = DEFAULT_IDL } = parser

  const {
    customer: customProgramAddr,
    provider: providerProgramAddress,
    idl: idlProgramAddr,
  } = programAddresses

  const paramProgramAddr = useMemo(() => {
    let programAddr = DEFAULT_IDL_PROGRAM_ADDRESS.toBase58()
    // Provider program address
    if (account.isAddress(providerProgramAddress))
      programAddr = providerProgramAddress
    // IDL Program Address - Medium recommend
    if (account.isAddress(idlProgramAddr)) programAddr = idlProgramAddr
    // Custom program Address - High recommend
    if (account.isAddress(customProgramAddr)) programAddr = customProgramAddr

    return programAddr
  }, [customProgramAddr, idlProgramAddr, providerProgramAddress])

  return useMemo(
    () => new Program(idl, paramProgramAddr, provider),
    [idl, paramProgramAddr, provider],
  )
}
