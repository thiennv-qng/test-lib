import { useEffect } from 'react'
import { account } from '@senswap/sen-js'
import IonIcon from '@sentre/antd-ionicon'
import { Idl } from '@project-serum/anchor'

import ViewUploaded from './viewUploaded'

import { IdlParser } from 'helpers'
import { useParser } from '../providers/parser.provider'
import { Typography } from 'components'

const UploadFIle = () => {
  const {
    uploadIdl,
    parser,
    setProgramAddress,
    programAddress: systemProgramAddr,
  } = useParser()
  const { idl } = parser || {}

  const upload = (file: FileList | null) => {
    if (!file) return
    const fileReader = new FileReader()
    fileReader.readAsText(file[0], 'UTF-8')
    fileReader.onload = (e) => {
      try {
        if (!e.target?.result) return
        const idl = JSON.parse(e.target.result.toString()) as Idl
        let validIdl = idl.name && idl.instructions.length && idl.version
        if (validIdl) return uploadIdl(idl)
      } catch (err: any) {
        // do notthing
      }
    }
  }

  useEffect(() => {
    if (!idl) return

    const programAddress = IdlParser.getProgramAddress(idl)
    if (
      account.isAddress(programAddress) &&
      !account.isAddress(systemProgramAddr)
    )
      setProgramAddress(programAddress)
  }, [idl, setProgramAddress, systemProgramAddr])

  if (!!idl) return <ViewUploaded />

  return (
    <div className="relative border border-dashed border-[#B3B3B3] rounded-[8px] p-[24px] bg-[#0000000d]">
      <label>
        <input
          type="file"
          accept=".json"
          onChange={(e) => upload(e.target.files)}
          className="absolute opacity-0 w-full h-full top-0 left-0 z-10 cursor-pointer"
        />
        <div className="flex flex-col items-center">
          <div className="w-[24px] mb-[8px] text-[24px]">
            <IonIcon name="cloud-upload-outline" />
          </div>
          <Typography>Upload</Typography>
          <Typography secondary>Support JSON</Typography>
        </div>
      </label>
    </div>
  )
}

export default UploadFIle
