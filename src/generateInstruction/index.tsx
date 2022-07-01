import { useState } from 'react'

import Button from 'components/ui/button'
import ViewTxInstructions from './viewTxInstructions'

import { convertStringDataToPubKey } from 'helpers'
import { useParser } from 'providers/parser.provider'
import { useProgram } from 'hooks/useProgram'
import { useArgs } from 'hooks/useArgs'
import { useRemainingAccounts } from 'hooks/useRemainingAccounts'

const GenerateInstruction = () => {
  const [loading, setLoading] = useState(false)
  const { parser, setTxInstructions } = useParser()
  const { accountsMetas: accountsMeta, ixSelected } = parser
  const program = useProgram()
  const args = useArgs(ixSelected)
  const remainingAccounts = useRemainingAccounts(ixSelected)

  const onInit = async () => {
    try {
      setLoading(true)
      const accountsMetaPubkey = convertStringDataToPubKey(accountsMeta)
      const instruction = await program.methods[ixSelected]
        .call(this, ...args)
        .accounts(accountsMetaPubkey)
        .remainingAccounts(remainingAccounts)
        .instruction()

      return setTxInstructions({ name: ixSelected, data: instruction })
    } catch (err) {
      console.log(err)
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
