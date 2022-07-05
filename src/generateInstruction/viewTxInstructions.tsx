import { Fragment, useCallback, useEffect, useState } from 'react'

import { Expand, Typography } from 'components'

import { TransactionInstruction, useParser } from 'providers/parser.provider'
import { convertStringDataToPubKey } from 'helpers'
import { useProgram } from 'hooks/useProgram'
import { useArgs } from 'hooks/useArgs'
import { useRemainingAccounts } from 'hooks/useRemainingAccounts'
import LoadingMask from 'components/ui/loadingMask'

const ViewTxInstructions = () => {
  const { txInstructions } = useParser()

  const [loading, setLoading] = useState(false)
  const { parser, setTxInstructions } = useParser()
  const { accountsMetas: accountsMeta, ixSelected } = parser
  const program = useProgram()
  const args = useArgs(ixSelected)
  const remainingAccounts = useRemainingAccounts(ixSelected)

  const onGenerateInstruction = useCallback(async () => {
    try {
      setLoading(true)
      const accountsMetaPubkey = convertStringDataToPubKey(accountsMeta)
      const instruction = await program.methods[ixSelected]
        .call(this, ...args)
        .accounts(accountsMetaPubkey)
        .remainingAccounts(remainingAccounts)
        .instruction()

      if (!!instruction)
        setTxInstructions({ name: ixSelected, data: instruction })
    } catch (err) {
      console.log(err)
      setTxInstructions()
    } finally {
      setLoading(false)
    }
  }, [
    accountsMeta,
    args,
    ixSelected,
    program.methods,
    remainingAccounts,
    setTxInstructions,
  ])

  const getInstructToView = (data: TransactionInstruction) => {
    try {
      return JSON.stringify(data, null, 2)
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    onGenerateInstruction()
  }, [onGenerateInstruction])

  if (!txInstructions || !Object.keys(txInstructions).length)
    return <Fragment />

  const keyTxInstructs = Object.keys(txInstructions || {})

  return (
    <div className="grid gird-cols-1 gap-8">
      {keyTxInstructs.map((key, idx) => {
        const data = txInstructions[key]
        return (
          <div className="relative flex flex-col" key={idx}>
            <Expand
              header={
                <Typography
                  level={5}
                  className="capitalize font-bold !text-white"
                >
                  {key}
                </Typography>
              }
            >
              <div className="p-4 bg-[#181C36] text-white">
                <pre className="flex flex-col">{getInstructToView(data)}</pre>
              </div>
            </Expand>
            {key === ixSelected && loading && <LoadingMask />}
          </div>
        )
      })}
    </div>
  )
}

export default ViewTxInstructions
