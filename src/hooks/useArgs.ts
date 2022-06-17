import { useCallback, useEffect, useState } from 'react'

import { useParser } from 'providers/parser.provider'
import { useIdlInstruction } from './useIdlInstruction'
import { normalizeAnchorArgs } from 'helpers'

type ArgsType = any[]

export const useArgs = (ixName: string): ArgsType => {
  const { argsMetas } = useParser().parser
  const [args, setArgs] = useState<ArgsType>([])
  const idlInstruction = useIdlInstruction(ixName)

  const parserArgs = useCallback(() => {
    const args = argsMetas[ixName] || []
    const parsedArgs = normalizeAnchorArgs(args, idlInstruction)
    setArgs(parsedArgs)
  }, [argsMetas, idlInstruction, ixName])
  useEffect(() => {
    parserArgs()
  }, [parserArgs])

  return args
}
