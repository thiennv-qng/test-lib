import { Button, Input, Typography } from 'components'
import Empty from 'components/ui/empty'

import { KeypairMeta, useParser } from 'providers/parser.provider'

type ContextAccountProps = {
  onChange: (value: KeypairMeta) => void
}

const RecentAccount = ({ onChange }: ContextAccountProps) => {
  const { parser } = useParser()
  const { accountsMetas: accountsMeta } = parser || {}

  if (!Object.keys(accountsMeta).length) return <Empty />

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 gap-4">
        {Object.keys(accountsMeta).map((key, idx) => {
          const val = accountsMeta?.[key].publicKey
          return (
            <div className="grid grid-cols-1 gap-1" key={idx}>
              <Typography secondary>{key}</Typography>
              <div className="flex flex-row gap-4">
                <Input
                  className="flex-auto"
                  value={val}
                  onChange={() => {}}
                  bordered={false}
                />
                <Button
                  type="text"
                  className="font-bold"
                  onClick={() => onChange({ publicKey: val })}
                >
                  Select
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentAccount
