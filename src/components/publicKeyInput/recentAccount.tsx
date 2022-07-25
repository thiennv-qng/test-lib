import { Fragment } from 'react'

import { Button, Input, Typography } from 'components'
import Empty from 'components/ui/empty'

import { KeypairMeta, useParser } from 'providers/parser.provider'

type InputRecentsProps = {
  data: string
  onChange: (value: KeypairMeta) => void
}
const InputRecents = ({ data, onChange }: InputRecentsProps) => {
  return (
    <div className="flex flex-row gap-4">
      <Input
        className="flex-auto"
        value={data}
        onChange={() => {}}
        bordered={false}
      />
      <Button
        type="text"
        className="font-bold"
        onClick={() => onChange({ publicKey: data })}
      >
        Select
      </Button>
    </div>
  )
}

type WrapInputRecentsProps = {
  data: string | string[]
  onChange: (value: KeypairMeta) => void
}
const WrapInputRecents = ({ data, onChange }: WrapInputRecentsProps) => {
  if (typeof data === 'string')
    return <InputRecents data={data} onChange={onChange} />
  return (
    <Fragment>
      {data.map((item, idx) => (
        <InputRecents data={item} onChange={onChange} key={idx} />
      ))}
    </Fragment>
  )
}

type ContextAccountProps = {
  onChange: (value: KeypairMeta) => void
}
const RecentAccount = ({ onChange }: ContextAccountProps) => {
  const { parser } = useParser()
  const { recents } = parser || {}

  if (!Object.keys(recents).length) return <Empty />

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 gap-4">
        {Object.keys(recents).map((key, idx) => {
          const val = recents?.[key]
          return (
            <div className="grid grid-cols-1 gap-1" key={idx}>
              <Typography secondary>{key}</Typography>
              <WrapInputRecents data={val} onChange={onChange} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentAccount
