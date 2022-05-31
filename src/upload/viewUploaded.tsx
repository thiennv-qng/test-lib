import IonIcon from '@sentre/antd-ionicon'

import Typography from '../components/typography'
import UploadFIle from './uploadFile'

import { useParser } from '../providers/parser.provider'

const ViewUploaded = () => {
  const { parser, removeIdl } = useParser()
  const { idl, programAddress } = parser || {}

  const remove = () => {
    removeIdl()
    return true
  }
  const isEmptyProgramAddr = !programAddress

  if (!idl) return <UploadFIle />

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-nowrap justify-between gap-[6px] border border-solid border-[#B3B3B3] rounded-[8px] px-[16px] py-[10px] bg-[#0000000d] text-[16px]">
        <div className="w-[24px]">
          <IonIcon name="document-attach-outline" />
        </div>
        <Typography className="flex-auto">{idl?.name}</Typography>
        <div className="w-[24px] cursor-pointer" onClick={remove}>
          <IonIcon name="close-outline" />
        </div>
      </div>
      {isEmptyProgramAddr && (
        <Typography style={{ color: '#F9575E', fontSize: 12 }}>
          The program address is undefined. Please update your IDL to use the
          program.
        </Typography>
      )}
    </div>
  )
}

export default ViewUploaded
