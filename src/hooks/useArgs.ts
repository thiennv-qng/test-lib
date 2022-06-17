import { useCallback, useEffect, useState } from 'react'

import { useParser } from 'providers/parser.provider'
import { useIdlInstruction } from './useIdlInstruction'
import { normalizeAnchorArgs } from 'helpers'

// TODO: fix type
type ArgsType = any[]
export const useArgs = (ixName: string): ArgsType => {
  const { argsMetas } = useParser().parser
  const [args, setArgs] = useState<ArgsType>([])
  // const idlInstruction = useIdlInstruction(ixName)

  const parserArgs = useCallback(() => {
    // const args = argsMetas[ixName]
    const parsedArgs: ArgsType = [] //normalizeAnchorArgs(args, idlInstruction)
    setArgs(parsedArgs)
  }, [argsMetas, ixName])
  useEffect(() => {
    parserArgs()
  }, [parserArgs])

  return args
}
