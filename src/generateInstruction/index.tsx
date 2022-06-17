import { useCallback, useState } from 'react'
import { PublicKey } from '@solana/web3.js'

import Button from 'components/button'
import ViewTxInstructions from './viewTxInstructions'

import { convertStringDataToPubKey } from 'helpers'
import { useParser } from 'providers/parser.provider'
import { useProgram } from 'hooks/useProgram'
import { useArgs } from 'hooks/useArgs'

const GenerateInstruction = () => {
  const [loading, setLoading] = useState(false)
  const { parser, setTxInstructions } = useParser()
  const {
    accountsMetas: accountsMeta,
    ixSelected,
    remainingAccounts,
  } = parser || {}
  const program = useProgram()
  const args = useArgs(ixSelected)

  const initInstructionWithArgs = useCallback(
    async (data: Record<string, PublicKey>) => {
      return await program.methods[ixSelected](args).accounts(data)
    },
    [args, ixSelected, program.methods],
  )

  const initInstructionNonArgs = useCallback(
    async (data: Record<string, PublicKey>) => {
      return await program.methods[ixSelected]().accounts(data)
    },
    [ixSelected, program.methods],
  )

  const onInit = async () => {
    try {
      setLoading(true)

      const accountsMetaPubkey = convertStringDataToPubKey(accountsMeta)
      let nextRemainingAccounts = []

      for (const remainingAccout of remainingAccounts[ixSelected] || []) {
        const nextRemainingAccount = {
          ...remainingAccout,
          pubkey: new PublicKey(remainingAccout.pubkey),
        }
        nextRemainingAccounts.push(nextRemainingAccount)
      }

      const instruction = !args.length
        ? await initInstructionNonArgs(accountsMetaPubkey)
        : await initInstructionWithArgs(accountsMetaPubkey)

      const data = await instruction
        .remainingAccounts(nextRemainingAccounts)
        .instruction()

      return setTxInstructions({ name: ixSelected, data })
    } catch (err) {
      console.log(err, 'err')
      return setTxInstructions()
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
