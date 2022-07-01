import { useState } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import SystemAccount from './systemAccount'
import ContextAccount from './contextAccount'
import IdlAccount from './idlAccount'
import TokenAccount from './tokenAccount'
import Pda from './pda'
import { Modal, Input, Button, Select, Typography } from 'components'

import { AccountsMeta } from 'providers/parser.provider'
import { AddressCategory } from 'types'

export const SELECT_SYSTEM = [
  AddressCategory.context,
  AddressCategory.idl,
  AddressCategory.pda,
  AddressCategory.system,
  AddressCategory.token,
]

type ModalViewProps = {
  inputType: string
  onChange: (val: string) => void
}

const ModalView = ({ inputType, onChange }: ModalViewProps) => {
  switch (inputType) {
    case AddressCategory.context:
      return <ContextAccount onClick={onChange} />
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
  name: string
  value: string
  onChange: (value: AccountsMeta) => void
  size?: number
  placeholder?: string
  bordered?: boolean
  defaultCategory?: AddressCategory
  onRemove?: () => void
  acceptRemove?: boolean
}

const PublicKeyInput = ({
  name,
  value,
  onChange,
  placeholder = 'Input or select your types',
  defaultCategory = AddressCategory.system,
  onRemove = () => {},
  acceptRemove = false,
}: PubicKeyInputProps) => {
  const [visible, setVisible] = useState(false)
  const [category, setCategory] = useState<AddressCategory>(defaultCategory)

  const onChangePublicKey = (address: string) => {
    onChange({ publicKey: address, privateKey: '' })
    setVisible(false)
  }

  return (
    <div className="flex flex-col">
      <Typography className="capitalize text-gray-400">{name}</Typography>
      <div className="flex flex-nowrap gap-[16px]">
        <Input
          className="flex-auto"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChangePublicKey(e.target.value)}
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
        {acceptRemove && (
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
            {name}
          </Typography>
          <ModalView inputType={category} onChange={onChangePublicKey} />
        </div>
      </Modal>
    </div>
  )
}

export default PublicKeyInput
