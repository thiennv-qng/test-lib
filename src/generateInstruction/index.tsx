import { useCallback, useState } from 'react'
import { Program } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'

import Button from 'components/button'

import { convertStringDataToPubKey, getAnchorProvider } from 'helpers'
import { useParser } from 'providers/parser.provider'

type GenerateInstructionProps = { thien?: string }
const GenerateInstruction = ({ thien }: GenerateInstructionProps) => {
  const [loading, setLoading] = useState(false)
  const { parser, connection, setTxInstructions, txInstructions } = useParser()
  const {
    idl,
    programAddress,
    accountsMeta,
    argsMeta,
    instructionSelected,
    instructionIdl,
  } = parser || {}

  const getProgram = useCallback(() => {
    if (!idl || !programAddress || !connection) return
    const provider = getAnchorProvider(connection)
    return new Program(idl, programAddress, provider)
  }, [connection, idl, programAddress])

  const initInstructionNonArgs = useCallback(
    async (data: Record<string, PublicKey>) => {
      const program = getProgram()
      if (!program || !instructionSelected) return

      return await program.methods[instructionSelected]().accounts(data)
    },
    [getProgram, instructionSelected],
  )

  const initInstruction = useCallback(
    async (data: Record<string, PublicKey>) => {
      const program = getProgram()
      if (!program || !instructionSelected) return
      return await program.methods[instructionSelected](argsMeta).accounts(data)
    },
    [argsMeta, getProgram, instructionSelected],
  )

  const onInit = async () => {
    try {
      setLoading(true)
      const accountsMetaPubkey = convertStringDataToPubKey(accountsMeta)

      let instruction = undefined
      if (!!instructionIdl?.args.length)
        instruction = await initInstruction(accountsMetaPubkey)
      instruction = await initInstructionNonArgs(accountsMetaPubkey)
      const data = await instruction?.instruction()
      if (!data) return setTxInstructions()
      return setTxInstructions({ name: instructionSelected || '', data })
    } catch (err) {
      console.log(err, 'err')
    } finally {
      setLoading(false)
    }
  }
  console.log(txInstructions, 'txInstructions')

  return (
    <div>
      <Button onClick={onInit} block loading={loading}>
        Generate Instruction
      </Button>
    </div>
  )
}

export default GenerateInstruction
