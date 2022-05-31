import { useState } from 'react'

import SystemAccount from './systemAccount'
import ContextAccount from './contextAccount'
import IdlAccount from './idlAccount'
import TokenAccount from './tokenAccount'
import Pda from './pda'
import Modal from '../modal'
import Input from '../input'
import Button from '../button'

import { AccountsMeta } from '../../providers/parser.provider'
import { AddressCategory } from '../../constants'
import Typography from 'components/typography'
import Select from 'components/select'

type PubicKeyInputProps = {
  name: string
  value: string
  onChange: (value: AccountsMeta) => void
  size?: number
  placeholder?: string
  bordered?: boolean
  defaultCategory?: AddressCategory
}
type ModalViewProps = {
  selected: string
  onChange: (val: string) => void
}

export const SELECT_SYSTEM = [
  AddressCategory.context,
  AddressCategory.idl,
  AddressCategory.pda,
  AddressCategory.system,
  AddressCategory.token,
]

const ModalView = ({ selected, onChange }: ModalViewProps) => {
  switch (true) {
    case selected === AddressCategory.context:
      return <ContextAccount onClick={onChange} />
    case selected === AddressCategory.idl:
      return <IdlAccount onChange={onChange} />
    case selected === AddressCategory.system:
      return <SystemAccount onChange={onChange} />
    case selected === AddressCategory.token:
      return <TokenAccount onChange={onChange} />
    default:
      return <Pda onChange={onChange} />
  }
}

const PublicKeyInput = ({
  name,
  value,
  onChange,
  placeholder = 'Input or select your types',
  defaultCategory = AddressCategory.system,
}: PubicKeyInputProps) => {
  const [visible, setVisible] = useState(false)
  const [category, setCategory] = useState<AddressCategory>(defaultCategory)

  console.log('defaultCategory', defaultCategory)
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
          placeholder=""
          onValue={onChangePublicKey}
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
          // @ts-ignore
          onValue={setCategory}
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
      </div>
      {/* Advanced input */}
      <Modal visible={visible} onClose={() => setVisible(false)}>
        <div className="flex flex-col gap-6">
          <Typography level={5}>{name}</Typography>
          <ModalView selected={category} onChange={onChangePublicKey} />
        </div>
      </Modal>
    </div>
  )
}

export default PublicKeyInput
