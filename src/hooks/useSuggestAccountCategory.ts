import { useCallback } from 'react'

import { useParser } from 'providers/parser.provider'
import { AddressCategory } from 'types'

export const useSuggestAccountCategory = () => {
  const { parser } = useParser()
  const { idl } = parser

  const findDefaultCategory = useCallback(
    (accountName: string) => {
      if (!idl) return
      const name = accountName.toLowerCase()
      if (['signer', 'authority'].includes(name)) return AddressCategory.recents
      // Check IDL accounts type
      if (idl.accounts) {
        for (const accountType of idl.accounts) {
          for (const field of accountType.type.fields) {
            if (name.includes(field.name.toLowerCase()))
              return AddressCategory.idl
          }
        }
      }
      if (name.includes('program')) return AddressCategory.system
      if (
        name.includes('tokenaccount') ||
        name.includes('associated') ||
        name.includes('treasury')
      )
        return AddressCategory.token

      return AddressCategory.system
    },
    [idl],
  )

  return { findDefaultCategory }
}
