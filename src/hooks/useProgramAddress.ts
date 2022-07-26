import { useParser } from 'providers/parser.provider'
import { useMemo } from 'react'

export const useProgramAddress = () => {
  const { programAddresses } = useParser()
  const {
    customer: customProgramAddr,
    idl: idlProgramAddr,
    provider: providerProgramAddr,
  } = programAddresses

  const systemProgramAddr = useMemo(
    () => customProgramAddr || idlProgramAddr || providerProgramAddr,
    [customProgramAddr, idlProgramAddr, providerProgramAddr],
  )

  return systemProgramAddr
}
