import IonIcon from '@sentre/antd-ionicon'

import { Typography, Tooltip } from 'components'
import UploadFIle from './uploadFile'

import { useParser } from '../providers/parser.provider'

const UploadFileName = () => {
  const { parser } = useParser()
  const { idl, programAddress } = parser || {}

  const isEmptyProgramAddr = !programAddress

  if (isEmptyProgramAddr)
    return (
      <Tooltip
        title={
          <Typography style={{ color: '#F9575E', fontSize: 12 }}>
            Warning
          </Typography>
        }
        description={
          <Typography style={{ color: '#F9575E', fontSize: 12 }}>
            The program address is undefined!
          </Typography>
        }
        width={250}
      >
        <div className="flex flex-row gap-2 text-[#F9575E]">
          <IonIcon name="document-attach-outline" />
          <Typography className="flex-auto">{idl?.name}</Typography>
        </div>
      </Tooltip>
    )

  return (
    <div className="flex flex-row gap-2 text-green-600">
      <IonIcon name="document-attach-outline" />
      <Typography className="flex-auto">{idl?.name}</Typography>
    </div>
  )
}

type ViewUploadedProps = { onClick?: () => void }
const ViewUploaded = ({ onClick = () => {} }: ViewUploadedProps) => {
  const { parser, removeIdl } = useParser()
  const { idl } = parser || {}

  const remove = () => {
    removeIdl()
    return true
  }

  if (!idl) return <UploadFIle />

  return (
    <div className="flex flex-col gap-1">
      <div className="relative flex flex-nowrap justify-between gap-[6px] border border-solid border-[#B3B3B3] rounded-[8px] px-[16px] py-[10px] bg-[#0000000d] text-[16px]">
        <UploadFileName />
        <div className="w-[24px] cursor-pointer" onClick={remove}>
          <IonIcon name="trash-outline" />
        </div>
      </div>
    </div>
  )
}

export default ViewUploaded
