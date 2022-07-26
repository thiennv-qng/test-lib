import { web3 } from '@project-serum/anchor'
import {
  decodeIxData,
  getMultipleAccounts,
  ixDiscriminator,
  SolanaExplorer,
} from '@sen-use/web3'
import { useIdlInstruction } from 'hooks/useIdlInstruction'
import { useParser } from 'providers/parser.provider'
import { useCallback, useMemo, useState } from 'react'
import { useOnChangeProvider } from './useOnChangeProvider'
import { useProgramAddress } from './useProgramAddress'

type IxLog = {
  accounts: web3.PublicKey[]
  data: string
  programId: web3.PublicKey
}

export const useSuggestProgramAccounts = () => {
  const {
    connection,
    parser: { ixSelected, accountsMetas },
  } = useParser()
  const [loading, setLoading] = useState(false)
  const ixIdl = useIdlInstruction(ixSelected)
  const programAddr = useProgramAddress()
  const { onChangeAccount } = useOnChangeProvider()

  const currentAccounts = useMemo(() => {
    const accounts: string[] = []
    for (const acc of ixIdl.accounts) {
      let accountAddr = accountsMetas[acc.name]
      if (!accountAddr) {
        accounts.push('')
        continue
      }
      accounts.push(accountAddr.publicKey)
    }
    return accounts
  }, [accountsMetas, ixIdl.accounts])

  const getExplorerAddress = useCallback(async () => {
    const pubKeys: web3.PublicKey[] = []
    for (const addr of currentAccounts)
      if (addr) pubKeys.push(new web3.PublicKey(addr))

    const accountDatas = await getMultipleAccounts(
      new web3.Connection(connection),
      pubKeys,
    )
    for (const data of accountDatas) {
      if (data?.account.owner.toBase58() === programAddr) {
        return data.publicKey
      }
    }
  }, [connection, currentAccounts, programAddr])

  const fetchIxLogs = useCallback(async () => {
    const explorerAddress = await getExplorerAddress()
    if (!explorerAddress) return []
    const explorer = new SolanaExplorer(new web3.Connection(connection))
    const transLogs = await explorer.fetchTransactions(
      explorerAddress.toBase58(),
      {},
    )
    const ixLogs: IxLog[] = []
    for (const transLog of transLogs) {
      const instructions = transLog.transaction.message.instructions
      // @ts-ignore
      for (const ix of instructions as IxLog[]) {
        if (ix?.programId.toBase58() !== programAddr) continue
        const ixData = Array.from(decodeIxData(ix.data)).slice(0, 8)
        const discriminator = Array.from(ixDiscriminator(ixSelected))
        if (ixData.toString() !== discriminator.toString()) continue
        ixLogs.push(ix)
      }
    }
    return ixLogs
  }, [connection, getExplorerAddress, ixSelected, programAddr])

  const autoAccount = useCallback(
    async (accountName: string) => {
      try {
        setLoading(true)

        const ixLogs = await fetchIxLogs()
        // Get fist log data
        const suggestAccounts = ixLogs[0]?.accounts.map((e) => e.toBase58())
        if (!suggestAccounts) return
        // Init point
        const points = suggestAccounts.map((addr) => ({
          total: 1,
          addrs: [addr],
        }))
        for (let i = 1; i < ixLogs.length; i++) {
          const logData = ixLogs[i]
          for (let k = 0; k < logData.accounts.length; k++) {
            const addr = logData.accounts[k].toBase58()
            if (!points[k].addrs.includes(addr)) points[k].total++
            points[k].addrs.push(addr)
          }
        }

        let accountIndex = -1
        for (let i = 0; i < ixIdl.accounts.length; i++) {
          if (ixIdl.accounts[i].name !== accountName) continue
          accountIndex = i
          break
        }
        const logPoint = points[accountIndex]
        if (!logPoint || logPoint.total > 1) return

        onChangeAccount(accountName, points[accountIndex].addrs[0])
      } catch (error) {
      } finally {
        setLoading(false)
      }
    },
    [fetchIxLogs, ixIdl.accounts, onChangeAccount],
  )

  return { autoAccount, loading }
}
