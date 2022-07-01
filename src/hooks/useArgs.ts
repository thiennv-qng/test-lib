import { useCallback, useEffect, useState } from 'react'

import { useParser } from 'providers/parser.provider'
import { useIdlInstruction } from './useIdlInstruction'
import { normalizeAnchorArgs } from 'helpers'

type ArgsType = any[]

export const useArgs = (ixName: string): ArgsType => {
  const { argsMetas } = useParser().parser
  const [args, setArgs] = useState<ArgsType>([])
  const idlInstruction = useIdlInstruction(ixName)
  const { parser } = useParser()

  const parserArgs = useCallback(() => {
    const args = argsMetas[ixName] || []
    try {
      const parsedArgs = normalizeAnchorArgs(args, idlInstruction, parser)
      setArgs(parsedArgs)
    } catch (error) {
      console.log('error', error)
    }
  }, [argsMetas, idlInstruction, ixName, parser])
  useEffect(() => {
    parserArgs()
  }, [parserArgs])

  return args
}
