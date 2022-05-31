import { useState } from 'react'
import { IdlType } from '@project-serum/anchor/dist/cjs/idl'

import DefinedInput from './definedInput'
import ArrayInput from './arrayInput'
import Modal from '../modal'
import Input from '../input'
import Button from '../button'
import Typography from 'components/typography'
import PublicKeyInput from 'components/publicKeyInput'

import { useParser } from '../../providers/parser.provider'
import { IdlParser } from 'helpers'

const NORMAL_TYPES = [
  'u8',
  'i8',
  'u16',
  'i16',
  'u32',
  'i32',
  'f32',
  'u64',
  'i64',
  'f64',
  'u128',
  'i128',
]
type WrapInputProps = {
  idlType: any
  inputName: string
  onChange: (value: string) => void
}
const WrapInput = ({ inputName, idlType, onChange }: WrapInputProps) => {
  const { parser } = useParser()
  if (!parser.idl?.accounts) return null

  if (idlType['vec'])
    return <ArrayInput idlType={idlType['vec']} onChange={onChange} />
  if (idlType['array']) {
    if (Array.isArray(idlType['array'])) {
      return <ArrayInput idlType={idlType['array'][0]} onChange={onChange} />
    }
    return <ArrayInput idlType={idlType['array']} onChange={onChange} />
  }

  if (idlType['defined']) {
    return (
      <WrapInput
        idlType={idlType['defined']}
        inputName={inputName}
        onChange={onChange}
      />
    )
  }

  return <DefinedInput name={idlType} onChange={onChange} />
}

type ParamInputProps = {
  name: string
  value: string
  idlType: IdlType
  onChange: (val: string) => void
  placeholder?: string
}

const ParamInput = ({
  name,
  value,
  idlType,
  onChange,
  placeholder = 'Input or select your types',
}: ParamInputProps) => {
  const [visible, setVisible] = useState(false)

  const onChangeWrapInput = (val: string) => {
    onChange(val)
    setVisible(false)
  }

  const isExist = !NORMAL_TYPES.includes(idlType.toString())

  return (
    <div>
      {idlType === 'publicKey' ? (
        <PublicKeyInput
          name={name}
          onChange={(acc) => onChange(acc.publicKey)}
          value={value}
        />
      ) : (
        <div className="grid gird-cols-1 gap-1">
          <div className="flex flex-row gap-2">
            <Typography className="capitalize text-gray-400">{name}</Typography>
            <Typography secondary>
              ({IdlParser.getTypeOfParam(idlType)})
            </Typography>
          </div>
          <Input
            className="flex-auto"
            value={value}
            onValue={onChange}
            bordered={false}
            placeholder={placeholder}
            suffix={
              isExist && (
                <Button type="text" onClick={() => setVisible(true)}>
                  <Typography level={5}>Init</Typography>
                </Button>
              )
            }
          />
        </div>
      )}
      {/* Advanced input */}
      {!NORMAL_TYPES.includes(idlType.toString()) && (
        <Modal visible={visible} onClose={() => setVisible(false)}>
          <div className="grid grid-cols-1 gap-1">
            <Typography secondary style={{ textTransform: 'capitalize' }}>
              {name}
            </Typography>
            <WrapInput
              idlType={idlType}
              onChange={onChangeWrapInput}
              inputName={name}
            />
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ParamInput