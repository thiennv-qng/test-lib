import { useState, useEffect } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import SystemAccount from './systemAccount'
import ContextAccount from './contextAccount'
import IdlAccount from './idlAccount'
import TokenAccount from './tokenAccount'
import Pda from './pda'
import { Modal, Input, Button, Select, Typography } from 'components'

import { KeypairMeta } from 'providers/parser.provider'
import { useSuggestAccountCategory } from 'hooks/useSuggestAccountCategory'
import { AddressCategory } from 'types'

export const SELECT_SYSTEM = [
  AddressCategory.idl,
  AddressCategory.token,
  AddressCategory.pda,
  AddressCategory.context,
  AddressCategory.system,
]

type ModalViewProps = {
  inputType: string
  onChange: (val: KeypairMeta) => void
}

const ModalView = ({ inputType, onChange }: ModalViewProps) => {
  switch (inputType) {
    case AddressCategory.context:
      return <ContextAccount onChange={onChange} />
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
}

const PublicKeyInput = ({
  accountName,
  value,
  placeholder = 'Input or select your types',
  onChange,
  onRemove,
}: PubicKeyInputProps) => {
  const [visible, setVisible] = useState(false)
  const [category, setCategory] = useState<AddressCategory>()
  const { findDefaultCategory } = useSuggestAccountCategory()

  // Select default category
  useEffect(() => {
    if (!category) {
      const defaultCategory = findDefaultCategory(accountName)
      setCategory(defaultCategory)
    }
  }, [category, findDefaultCategory, accountName])

  const onChangePublicKey = (keypair: KeypairMeta) => {
    onChange(keypair)
    setVisible(false)
  }

  if (!category) return null

  return (
    <div className="flex flex-col">
      <Typography className="capitalize text-gray-400">
        {accountName}
      </Typography>
      <div className="flex flex-nowrap gap-[16px]">
        <Input
          className="flex-auto"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChangePublicKey({ publicKey: e.target.value })}
          bordered={false}
          suffix={
            <Button type="text" onClick={() => setVisible(true)}>
              <Typography level={5}>Init</Typography>
            </Button>
          }
        />
        <Select
          style={{ minWidth: 120 }}
          value={category}
          onChange={(e) => setCategory(e.target.value as AddressCategory)}
        >
          {SELECT_SYSTEM.map((item, idx) => (
            <option
              style={{ textTransform: 'capitalize' }}
              value={item}
              key={idx}
            >
              {item}
            </option>
          ))}
        </Select>
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
          <Typography level={5} className="capitalize font-bold">
            {accountName}
          </Typography>
          <ModalView inputType={category} onChange={onChangePublicKey} />
        </div>
      </Modal>
    </div>
  )
}

export default PublicKeyInput
