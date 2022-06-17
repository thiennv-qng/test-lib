import { useCallback, useEffect, useState } from 'react'
import { web3 } from '@project-serum/anchor'
import { useParser } from 'providers/parser.provider'

export const useRemainingAccounts = (ixName: string): web3.AccountMeta[] => {
  const { remainingAccounts } = useParser().parser
  const [accounts, setAccounts] = useState<web3.AccountMeta[]>([])

  const parserAccountMetas = useCallback(() => {
    const accounts = remainingAccounts[ixName] || []
    setAccounts(
      accounts.map((acc) => {
        return { ...acc, pubkey: new web3.PublicKey(acc.address) }
      }),
    )
  }, [ixName, remainingAccounts])
  useEffect(() => {
    parserAccountMetas()
  }, [parserAccountMetas])

  return accounts
}
