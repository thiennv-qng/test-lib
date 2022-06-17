import { useCallback, useState } from 'react'
import { PublicKey } from '@solana/web3.js'

import Button from 'components/button'
import ViewTxInstructions from './viewTxInstructions'

import { convertStringDataToPubKey, normalizeAnchorArgs } from 'helpers'
import { useParser } from 'providers/parser.provider'
import { useProgram } from 'hooks/useProgram'

const GenerateInstruction = () => {
  const [loading, setLoading] = useState(false)
  const { parser, setTxInstructions } = useParser()
  const {
    accountsMeta,
    argsMeta,
    instructionSelected,
    instructionIdl,
    remainingAccounts,
  } = parser || {}
  const program = useProgram()

  const initInstructionNonArgs = useCallback(
    async (data: Record<string, PublicKey>) => {
      if (!program || !instructionSelected) return
      return await program.methods[instructionSelected]().accounts(data)
    },
    [instructionSelected, program],
  )

  const initInstruction = useCallback(
    async (data: Record<string, PublicKey>) => {
      if (!program || !instructionSelected || !instructionIdl) return
      const args = argsMeta[instructionSelected]
      const nomalizedArgsMeta = normalizeAnchorArgs(args, instructionIdl)
      return await program.methods[instructionSelected](
        ...nomalizedArgsMeta,
      ).accounts(data)
    },
    [argsMeta, instructionIdl, instructionSelected, program],
  )

  const onInit = async () => {
    try {
      if (!instructionSelected) return

      setLoading(true)

      const accountsMetaPubkey = convertStringDataToPubKey(accountsMeta)
      let nextRemainingAccounts = []

      for (const remainingAccout of remainingAccounts[instructionSelected] ||
        []) {
        const nextRemainingAccount = {
          ...remainingAccout,
          pubkey: new PublicKey(remainingAccout.pubkey),
        }
        nextRemainingAccounts.push(nextRemainingAccount)
      }

      let instruction = undefined
      if (!!instructionIdl?.args.length)
        instruction = await initInstruction(accountsMetaPubkey)
      else instruction = await initInstructionNonArgs(accountsMetaPubkey)

      const data = await instruction
        ?.remainingAccounts(nextRemainingAccounts)
        .instruction()
      if (!data) return setTxInstructions()
      return setTxInstructions({ name: instructionSelected || '', data })
    } catch (err) {
      console.log(err, 'err')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-10">
      <ViewTxInstructions />
      <Button onClick={onInit} block loading={loading} type="primary">
        Generate Instruction
      </Button>
    </div>
  )
}

export default GenerateInstruction
