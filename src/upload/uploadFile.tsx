import { useEffect } from 'react'
import { account } from '@senswap/sen-js'
import IonIcon from '@sentre/antd-ionicon'
import { Idl } from '@project-serum/anchor'

import ViewUploaded from './viewUploaded'
import { Empty, Typography } from 'components'

import { IdlParser } from 'helpers'
import { useParser } from '../providers/parser.provider'

const UploadFIle = () => {
  const { uploadIdl, parser, setProgramAddress, programAddresses } = useParser()
  const { idl } = parser || {}
  const { idl: idlProgramAddr } = programAddresses

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
    if (account.isAddress(programAddress) && programAddress !== idlProgramAddr)
      setProgramAddress('idl', programAddress)
  }, [idl, idlProgramAddr, setProgramAddress])

  if (!!idl) return <ViewUploaded />

  return (
    <div className="flex flex-col gap-10">
      <div className="flex border border-dashed border-[#B3B3B3] rounded-[8px] bg-[#0000000d] text-[16px]">
        <label className="flex flex-col w-full p-4 cursor-pointer">
          <input
            type="file"
            accept=".json"
            onChange={(e) => upload(e.target.files)}
            className="opacity-0 w-0 h-0"
          />
          <div className="flex w-full justify-between items-center gap-4">
            <div className="flex flex-auto gap-2">
              <Typography>Choose IDL file</Typography>
              <Typography secondary>(.JSON)</Typography>
            </div>
            <IonIcon name="cloud-upload-outline" />
          </div>
        </label>
      </div>
      <Empty />
    </div>
  )
}

export default UploadFIle
