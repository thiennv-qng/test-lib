import { web3 } from '@project-serum/anchor'
import { useState, useEffect, Fragment, useCallback } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import SystemAccount from './systemAccount'
import RecentAccount from './recentAccount'
import IdlAccount from './idlAccount'
import TokenAccount from './tokenAccount'
import Pda from './pda'
import { Modal, Input, Button, Typography } from 'components'

import { KeypairMeta, useParser } from 'providers/parser.provider'
import { useSuggestAccountCategory } from 'hooks/useSuggestAccountCategory'
import { AddressCategory } from 'types'
import { getAutocompleteSystemAccount } from 'helpers'
import Selection from 'components/ui/selection'
import { useSuggestProgramAccounts } from 'hooks/useSuggestProgramAccounts'

export const SELECT_SYSTEM = [
  AddressCategory.walletAddress,
  AddressCategory.newKeypair,
  AddressCategory.idl,
  AddressCategory.token,
  AddressCategory.pda,
  AddressCategory.recents,
  AddressCategory.system,
]

type ModalViewProps = {
  inputType: string
  onChange: (val: KeypairMeta) => void
}

const ModalView = ({ inputType, onChange }: ModalViewProps) => {
  switch (inputType) {
    case AddressCategory.recents:
      return <RecentAccount onChange={onChange} />
    case AddressCategory.idl:
      return <IdlAccount onChange={onChange} />
    case AddressCategory.system:
      return <SystemAccount onChange={onChange} />
    case AddressCategory.token:
      return <TokenAccount onChange={onChange} />
    default:
      return <Pda onChange={onChange} />
  }
}

type PubicKeyInputProps = {
  accountName: string
  value: string
  placeholder?: string
  onChange: (value: KeypairMeta) => void
  onRemove?: () => void
  onBlur?: (val: string) => void
}

const PublicKeyInput = ({
  accountName,
  value,
  placeholder = '',
  onChange,
  onRemove,
  onBlur = () => {},
}: PubicKeyInputProps) => {
  const [visible, setVisible] = useState(false)
  const [category, setCategory] = useState<AddressCategory>()
  const { findDefaultCategory } = useSuggestAccountCategory()
  const { walletAddress } = useParser()
  const { autoAccount } = useSuggestProgramAccounts(accountName)

  const onChangePublicKey = useCallback(
    (keypair: KeypairMeta) => {
      onChange(keypair)
      setVisible(false)
    },
    [onChange],
  )

  const onSelectCategory = (category: AddressCategory) => {
    setCategory(category)
    switch (category) {
      case AddressCategory.walletAddress:
        return onChange({ publicKey: walletAddress || '' })
      case AddressCategory.newKeypair:
        const newKeyPair = web3.Keypair.generate()
        return onChange({
          publicKey: newKeyPair.publicKey.toBase58(),
          privateKey: Buffer.from(newKeyPair.secretKey).toString('hex'),
        })
    }
    setVisible(true)
  }

  // Select default category
  useEffect(() => {
    if (!category) {
      const defaultCategory = findDefaultCategory(accountName)
      const suggestAutoCompleteAccount =
        getAutocompleteSystemAccount(accountName)
      if (!!suggestAutoCompleteAccount)
        onChange({ publicKey: suggestAutoCompleteAccount })

      setCategory(defaultCategory)
    }
  }, [accountName, category, findDefaultCategory, onChange])

  if (!category) return <Fragment />

  return (
    <div className="flex flex-col gap-[6px]">
      <Typography className="capitalize text-gray-600">
        {accountName}
      </Typography>
      <div className="flex flex-nowrap gap-[16px]">
        <Input
          className="flex-auto"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChangePublicKey({ publicKey: e.target.value })}
          onBlur={(e) => onBlur(e.target.value)}
          bordered={false}
          suffix={
            <Button type="text" onClick={() => autoAccount()}>
              <Typography level={5}>auto</Typography>
            </Button>
          }
        />

        <Selection
          style={{ maxWidth: 180 }}
          options={SELECT_SYSTEM.map((item) => {
            return { label: item, value: item }
          })}
          selected={category}
          onSelected={(val) => onSelectCategory(val as AddressCategory)}
        />
        {onRemove && (
          <Button
            type="text"
            onClick={onRemove}
            suffix={<IonIcon name="trash-outline" />}
          />
        )}
      </div>
      {/* Advanced input */}
      <Modal
        visible={visible}
        onClose={() => setVisible(false)}
        closeIcon={<IonIcon name="close-outline" />}
      >
        <div className="flex flex-col gap-10">
          <div className="flex flex-nowrap gap-2">
            <Typography level={5} className="capitalize font-bold">
              {category}
            </Typography>
            <Typography>({accountName})</Typography>
          </div>
          <ModalView inputType={category} onChange={onChangePublicKey} />
        </div>
      </Modal>
    </div>
  )
}

export default PublicKeyInput
