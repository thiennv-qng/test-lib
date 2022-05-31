import { Fragment } from 'react'

import { useParser } from 'providers/parser.provider'

const ViewTxInstructions = () => {
  const { txInstructions } = useParser()

  if (!txInstructions) return <Fragment />

  const keyTxInstructs = Object.keys(txInstructions || {})

  return (
    <div className="grid gird-cols-1 gap-4 p-4 bg-[#EBEBEB]">
      {keyTxInstructs.map((key, idx) => {
        const data = txInstructions[key]
        return (
          <div className="flex flex-col gap-4" key={idx}>
            <pre className="flex flex-col">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )
      })}
    </div>
  )
}

export default ViewTxInstructions
