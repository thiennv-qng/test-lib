import { Fragment } from 'react'

import { Expand, Typography } from 'components'

import { useParser } from 'providers/parser.provider'

const ViewTxInstructions = () => {
  const { txInstructions } = useParser()

  if (!txInstructions || !Object.keys(txInstructions).length)
    return <Fragment />

  const keyTxInstructs = Object.keys(txInstructions || {})

  return (
    <div className="grid gird-cols-1 gap-8">
      {keyTxInstructs.map((key, idx) => {
        const data = txInstructions[key]
        return (
          <div className="flex flex-col" key={idx}>
            <Expand
              header={
                <Typography
                  level={5}
                  className="capitalize font-bold !text-white"
                >
                  {key}
                </Typography>
              }
            >
              <div className="p-4 bg-[#181C36] text-white">
                <pre className="flex flex-col">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </Expand>
          </div>
        )
      })}
    </div>
  )
}

export default ViewTxInstructions
