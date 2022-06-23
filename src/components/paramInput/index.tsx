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
import IonIcon from '@sentre/antd-ionicon'
import BoolInput from './boolInput'

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

  const vecType = idlType['vec']
  const arrayType = idlType['array']
  const definedType = idlType['defined']

  if (!!vecType) return <ArrayInput idlType={vecType} onChange={onChange} />
  if (!!arrayType) {
    if (Array.isArray(!!arrayType)) {
      return <ArrayInput idlType={arrayType[0]} onChange={onChange} />
    }
    return <ArrayInput idlType={arrayType} onChange={onChange} />
  }

  if (!!definedType) {
    return (
      <WrapInput
        idlType={definedType}
        inputName={inputName}
        onChange={onChange}
      />
    )
  }

  return <DefinedInput name={idlType} onChange={onChange} />
}

type ArgsInputProps = {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  isExist?: boolean
  onClick?: () => void
  onRemove?: () => void
  acceptRemove?: boolean
  idlType: any
  inputName?: string
}
const ArgsInput = ({
  value,
  onChange,
  placeholder = '',
  isExist = false,
  onClick = () => {},
  onRemove = () => {},
  acceptRemove = false,
  inputName = '',
  idlType,
}: ArgsInputProps) => {
  const definedType = !!idlType['defined']
  const boolType = idlType === 'bool'

  if (boolType) return <BoolInput value={value} onChange={onChange} />

  if (definedType)
    return (
      <div className="flex flex-1 flex-row gap-4">
        <WrapInput
          idlType={idlType}
          onChange={onChange}
          inputName={inputName}
        />
        {acceptRemove && (
          <Button
            type="text"
            onClick={onRemove}
            suffix={<IonIcon name="trash-outline" />}
          />
        )}
      </div>
    )

  return (
    <div className="flex flex-1 flex-row gap-4">
      <Input
        className="flex-auto"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        bordered={false}
        placeholder={placeholder}
        suffix={
          isExist && (
            <Button type="text" onClick={onClick}>
              <Typography level={5}>Init</Typography>
            </Button>
          )
        }
      />
      {acceptRemove && (
        <Button
          type="text"
          onClick={onRemove}
          suffix={<IonIcon name="trash-outline" />}
        />
      )}
    </div>
  )
}

type ParamInputProps = {
  name: string
  value: string
  idlType: IdlType
  onChange: (val: string) => void
  placeholder?: string
  onRemove?: () => void
  acceptRemove?: boolean
}
const ParamInput = ({
  name,
  value,
  idlType,
  onChange,
  placeholder = 'Input or select your types',
  onRemove = () => {},
  acceptRemove = false,
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

          <ArgsInput
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onClick={() => setVisible(true)}
            onRemove={onRemove}
            acceptRemove={acceptRemove}
            isExist={isExist}
            idlType={idlType}
            inputName={name}
          />
        </div>
      )}
      {/* Advanced input */}
      {!NORMAL_TYPES.includes(idlType.toString()) && (
        <Modal
          visible={visible}
          onClose={() => setVisible(false)}
          closeIcon={<IonIcon name="close-outline" />}
        >
          <div className="grid grid-cols-1 gap-8">
            <Typography
              className="!flex flex-1"
              style={{
                textTransform: 'capitalize',
                fontWeight: 600,
              }}
            >
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
