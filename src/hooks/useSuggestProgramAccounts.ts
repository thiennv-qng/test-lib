import { web3 } from '@project-serum/anchor'
import {
  DataLoader,
  decodeIxData,
  getMultipleAccounts,
  ixDiscriminator,
  SolanaExplorer,
} from '@sen-use/web3'
import { useIdlInstruction } from 'hooks/useIdlInstruction'
import { useParser } from 'providers/parser.provider'
import { useCallback, useState } from 'react'
import { useOnChangeProvider } from './useOnChangeProvider'
import { useProgramAddress } from './useProgramAddress'

type IxLog = {
  accounts: web3.PublicKey[]
  data: string
  programId: web3.PublicKey
}

type AccountTracking = {
  total: number
  addrs: string[]
}

export const useSuggestProgramAccounts = (accountName: string) => {
  const {
    connection,
    parser: { ixSelected, accountsMetas },
  } = useParser()
  const [loading, setLoading] = useState(false)
  const ixIdl = useIdlInstruction(ixSelected)
  const programAddr = useProgramAddress()
  const { onChangeAccount } = useOnChangeProvider()

  const getCurrentAccounts = useCallback(() => {
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
    const currentAccounts = getCurrentAccounts()
    for (const addr of currentAccounts)
      if (addr) pubKeys.push(new web3.PublicKey(addr))

    const accountDatas = await DataLoader.load(
      `getExplorerAddress:${JSON.stringify(currentAccounts)}`,
      () => {
        return getMultipleAccounts(new web3.Connection(connection), pubKeys)
      },
    )

    for (const data of accountDatas) {
      if (data?.account.owner.toBase58() === programAddr) {
        return data.publicKey
      }
    }
  }, [connection, getCurrentAccounts, programAddr])

  const fetchIxLogs = useCallback(async () => {
    const explorerAddress = await getExplorerAddress()
    if (!explorerAddress) return []

    const transLogs = await DataLoader.load(
      `fetchIxLogs:${explorerAddress}`,
      () => {
        const explorer = new SolanaExplorer(new web3.Connection(connection))
        return explorer.fetchTransactions(explorerAddress.toBase58(), {})
      },
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

  const getAccountIndex = useCallback(() => {
    for (let i = 0; i < ixIdl.accounts.length; i++)
      if (ixIdl.accounts[i].name === accountName) return i
    throw new Error('Not find account name')
  }, [accountName, ixIdl.accounts])

  const autoAccount = useCallback(async () => {
    try {
      setLoading(true)

      const ixLogs = await fetchIxLogs()
      // Get fist log data
      const suggestAccounts = ixLogs[0]?.accounts.map((e) => e.toBase58())
      if (!suggestAccounts) return
      // Init Account tracking
      const trackings: AccountTracking[] = suggestAccounts.map((addr) => ({
        total: 1,
        addrs: [addr],
      }))
      for (let logIdx = 1; logIdx < ixLogs.length; logIdx++) {
        const logData = ixLogs[logIdx]
        for (let k = 0; k < logData.accounts.length; k++) {
          const addr = logData.accounts[k].toBase58()
          if (!trackings[k].addrs.includes(addr)) {
            trackings[k].total++
          }
          trackings[k].addrs.push(addr)
        }
      }

      let accountIndex = getAccountIndex()
      const accountTracking = trackings[accountIndex]
      const currentAccounts = getCurrentAccounts()

      for (let i = 0; i < trackings.length; i++) {
        const tracking = trackings[i]
        if (tracking.total !== accountTracking.total) continue
        const idx = tracking.addrs.indexOf(currentAccounts[i])
        if (idx === -1) continue
        return onChangeAccount(accountName, trackings[accountIndex].addrs[idx])
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [
    accountName,
    fetchIxLogs,
    getAccountIndex,
    getCurrentAccounts,
    onChangeAccount,
  ])

  return { autoAccount, loading }
}
