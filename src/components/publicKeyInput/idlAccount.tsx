import { useCallback, useEffect, useState } from 'react'
import { Program, web3 } from '@project-serum/anchor'
import IonIcon from '@sentre/antd-ionicon'

import Input from '../input'
import Button, { Spinner } from '../button'
import Empty from 'components/empty'

import { useParser } from '../../providers/parser.provider'
import { getAnchorProvider } from 'helpers'
import Typography from 'components/typography'
import Select from 'components/select'

const IdlAccount = ({ onChange }: { onChange: (val: string) => void }) => {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [accountType, setAccountType] = useState('')
  const [accountsViewer, setAccountsViewer] = useState<
    Record<string, string[]>
  >({})
  const { parser, connection } = useParser()
  const { idl, programAddress } = parser || {}

  const getProgram = useCallback(() => {
    if (!idl || !programAddress || !connection) return
    const provider = getAnchorProvider(connection)
    const program = new Program(idl, programAddress, provider)
    return program
  }, [connection, idl, programAddress])

  const onFetchAccountData = useCallback(async () => {
    try {
      setLoading(true)
      const program = getProgram()
      if (!program || !accountType || !address) return
      const accountPublicKey = new web3.PublicKey(address)

      const accountData = await program.account[
        accountType.toLowerCase()
      ].fetch(accountPublicKey)

      const newIdlAccountData: Record<string, string[]> = {}
      for (const key in accountData) {
        newIdlAccountData[key] = []
        // Parse publicKey
        try {
          const keyData: any = accountData[key]
          if (Array.isArray(keyData)) {
            for (const elm of keyData) {
              const pub = new web3.PublicKey(elm.toString())
              newIdlAccountData[key].push(pub.toBase58())
            }
          } else {
            const pub = new web3.PublicKey(keyData.toString())
            newIdlAccountData[key].push(pub.toBase58())
          }
        } catch (error) {
          /* Ignore */
        }
      }
      setAccountsViewer(newIdlAccountData)
    } catch (error) {
      setAccountsViewer({})
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [accountType, address, getProgram])

  useEffect(() => {
    onFetchAccountData()
  }, [onFetchAccountData])

  useEffect(() => {
    const fistAccount = idl?.accounts?.[0]?.name || ''
    if (fistAccount && !accountType) setAccountType(fistAccount)
  }, [accountType, idl?.accounts])

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-1">
        <Typography secondary>{accountType} address</Typography>
        <div className="flex flex-row gap-4">
          <Input
            value={address}
            onValue={setAddress}
            bordered={false}
            preffix={loading ? <Spinner /> : <IonIcon name="search-outline" />}
            className="flex-auto stroke-slate-500"
          />
          <Select
            value={accountType}
            style={{ minWidth: 120, minHeight: 32 }}
            onValue={() => {}}
          >
            {idl?.accounts?.map((acc, idx) => {
              return (
                <option value={acc.name} key={idx}>
                  {acc.name}
                </option>
              )
            })}
          </Select>
        </div>
      </div>

      <div className="grid gird-cols-1 gap-4 p-[24px] bg-stone-100">
        {!!Object.keys(accountsViewer).length ? (
          Object.keys(accountsViewer).map((key, idx) => {
            if (!accountsViewer[key].length) return null
            return (
              <div className="grid gird-cols-1 gap-1" key={idx}>
                <Typography secondary>{key}</Typography>
                <div className="grid gird-cols-1 gap-2">
                  {accountsViewer[key].map((val, jdx) => (
                    <div className="flex flex-row gap-4" key={jdx}>
                      <Input
                        className="flex-auto"
                        value={val}
                        onValue={() => {}}
                        bordered={false}
                      />
                      <Button onClick={() => onChange(val)}>Select</Button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          <Empty />
        )}
      </div>
    </div>
  )
}

export default IdlAccount
