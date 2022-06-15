import Button from '../button'

import Empty from '../empty'
import Input from '../input'

import { useParser } from '../../providers/parser.provider'
import Typography from 'components/typography'

const ContextAccount = ({ onClick }: { onClick: (val: string) => void }) => {
  const { parser } = useParser()
  const { accountsMeta } = parser || {}

  return (
    <div>
      {!Object.keys(accountsMeta).length ? (
        <Empty />
      ) : (
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
                    onValue={() => {}}
                    bordered={false}
                  />
                  <Button
                    type="text"
                    className="font-bold"
                    onClick={() => onClick(val)}
                  >
                    Select
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ContextAccount
