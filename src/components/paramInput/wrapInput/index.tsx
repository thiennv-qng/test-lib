import IonIcon from '@sentre/antd-ionicon'
import Button from 'components/button'
import Input from 'components/input'
import Typography from 'components/typography'
import BoolInput from './boolInput'
import InitInput from '../initInput'

import { IdlType as AnchorIdlType } from '@project-serum/anchor/dist/cjs/idl'

type WrapInputProps = {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  init?: boolean
  onClickInit?: () => void
  onRemove?: () => void
  idlType: AnchorIdlType
  inputName?: string
}
const WrapInput = ({
  value,
  onChange,
  placeholder = '',
  init = false,
  onClickInit = () => {},
  onRemove,
  inputName = '',
  idlType,
}: WrapInputProps) => {
  if (idlType === 'bool') return <BoolInput value={value} onChange={onChange} />

  // @ts-ignore
  if (idlType['defined'])
    return (
      <div className="flex flex-1 flex-row gap-4">
        <InitInput
          value={value}
          idlType={idlType}
          onChange={onChange}
          inputName={inputName}
        />
        {onRemove && (
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
          init && (
            <Button type="text" onClick={onClickInit}>
              <Typography level={5}>Init</Typography>
            </Button>
          )
        }
      />
      {onRemove && (
        <Button
          type="text"
          onClick={onRemove}
          suffix={<IonIcon name="trash-outline" />}
        />
      )}
    </div>
  )
}

export default WrapInput
