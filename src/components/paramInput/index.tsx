import { useState } from 'react'
import { IdlType as AnchorIdlType } from '@project-serum/anchor/dist/cjs/idl'

import IonIcon from '@sentre/antd-ionicon'
import { PublicKeyInput, Modal, Typography } from 'components'
import InitInput from './initInput'
import WrapInput from './wrapInput'

import { IdlParser } from 'helpers'

type ParamInputProps = {
  name: string
  value: string
  idlType: AnchorIdlType
  onChange: (val: string) => void
  placeholder?: string
  onRemove?: () => void
}
const ParamInput = ({
  name,
  value,
  idlType,
  onChange,
  placeholder = 'Input or select your types',
  onRemove,
}: ParamInputProps) => {
  const [visible, setVisible] = useState(false)

  const onChangeWrapInput = (val: string) => {
    onChange(val)
    setVisible(false)
  }

  if (idlType === 'publicKey')
    return (
      <PublicKeyInput
        accountName={name}
        onChange={(acc) => onChange(acc.publicKey)}
        value={value}
      />
    )

  const isNumberInput = /^[u|i|f]\d+$/.test(idlType.toString())
  const isInit = !isNumberInput

  return (
    <div>
      <div className="grid gird-cols-1 gap-1">
        <div className="flex flex-row gap-2">
          <Typography className="capitalize text-gray-400">{name}</Typography>
          <Typography secondary>
            ({IdlParser.getTypeOfParam(idlType)})
          </Typography>
        </div>
        <WrapInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onClickInit={() => setVisible(true)}
          onRemove={onRemove}
          init={isInit}
          idlType={idlType}
          inputName={name}
        />
      </div>

      {/* Advanced input */}
      {isInit && (
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
            <InitInput
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
