import { useState } from 'react'
import { IdlType } from '@project-serum/anchor/dist/cjs/idl'

import IonIcon from '@sentre/antd-ionicon'
import { PublicKeyInput, Modal, Input, Button, Typography } from 'components'
import DefinedInput from './definedInput'
import ArrayInput from './arrayInput'
import BoolInput from './boolInput'

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
  value?: string
  onChange: (value: string) => void
}
const WrapInput = ({
  value = '',
  inputName,
  idlType,
  onChange,
}: WrapInputProps) => {
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
        value={value}
        idlType={definedType}
        inputName={inputName}
        onChange={onChange}
      />
    )
  }

  return <DefinedInput name={idlType} value={value} onChange={onChange} />
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
          value={value}
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

  const isExistIdlType = !NORMAL_TYPES.includes(idlType.toString())
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
            isExist={isExistIdlType}
            idlType={idlType}
            inputName={name}
          />
        </div>
      )}
      {/* Advanced input */}
      {isExistIdlType && (
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
              value={value}
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
