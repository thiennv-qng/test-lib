import { useCallback, useEffect, useState } from 'react'
import { account } from '@senswap/sen-js'
import { web3 } from '@project-serum/anchor'

import { useParser } from 'providers/parser.provider'

export const useRemainingAccounts = (ixName: string): web3.AccountMeta[] => {
  const { remainingAccounts } = useParser().parser
  const [accounts, setAccounts] = useState<web3.AccountMeta[]>([])

  const parserAccountMetas = useCallback(() => {
    const accounts = remainingAccounts?.[ixName] || []

    if (!accounts.length) return setAccounts([])
    return setAccounts(
      accounts.map((acc) => {
        const publicKey = account.isAddress(acc.address)
          ? new web3.PublicKey(acc.address)
          : acc.address

        return { ...acc, pubkey: publicKey }
      }),
    )
  }, [ixName, remainingAccounts])

  useEffect(() => {
    parserAccountMetas()
  }, [parserAccountMetas])

  return accounts
}
