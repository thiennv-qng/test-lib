import React, { useCallback, useEffect, useState } from 'react'
import { utils, web3 } from '@project-serum/anchor'
import { account } from '@senswap/sen-js'

import PublicKeyInput from './index'
import Button from '../ui/button'
import { KeypairMeta } from 'providers/parser.provider'
import Typography from 'components/ui/typography'

const TokenAccount = ({
  onChange,
}: {
  onChange: (val: KeypairMeta) => void
}) => {
  const [mint, setMint] = useState('')
  const [owner, setOwner] = useState('')
  const [tokenAccount, setTokenAccount] = useState('')

  const validConfirm = !!account.isAddress(mint) && !!account.isAddress(owner)

  const getTokenAccountAddress = useCallback(async () => {
    if (!validConfirm) return
    try {
      const mintPub = new web3.PublicKey(mint)
      const ownerPub = new web3.PublicKey(owner)
      const newTokenAccount = await utils.token.associatedAddress({
        mint: mintPub,
        owner: ownerPub,
      })
      setTokenAccount(newTokenAccount.toBase58())
    } catch (error) {
      setTokenAccount('')
    }
  }, [mint, owner, validConfirm])

  useEffect(() => {
    getTokenAccountAddress()
  }, [getTokenAccountAddress])

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-4">
        <PublicKeyInput
          accountName="Mint"
          value={mint}
          onChange={(e) => setMint(e.publicKey)}
        />
        <PublicKeyInput
          accountName="Owner"
          value={owner}
          onChange={(e) => setOwner(e.publicKey)}
        />
      </div>
      <div className="grid grid-cols-1 gap-6">
        {/* Token account generated  */}
        {tokenAccount && (
          <div className="grid grid-cols-1 gap-2 p-4 rounded-md shadow-[0_0_15px_#d6d6d6]">
            <Typography secondary>PDA Token Address</Typography>
            <Typography>{tokenAccount}</Typography>
          </div>
        )}

        <Button
          type="primary"
          onClick={() => onChange({ publicKey: tokenAccount })}
          disabled={!tokenAccount}
          block
        >
          Done
        </Button>
      </div>
    </div>
  )
}

export default TokenAccount
