import { useEffect, useState } from 'react'
import IonIcon from '@sentre/antd-ionicon'

import TemplateView from '../idlViewer/templateView'
import UploadFIle from './uploadFile'
import ViewUploaded from './viewUploaded'
import Modal from '../components/modal'
import Button from 'components/button'
import GenerateInstruction from 'generateInstruction'

import { useParser } from '../providers/parser.provider'
import InstructionView from 'idlViewer/instructionView'

const UploadIdl = () => {
  const [visible, setVisible] = useState(false)
  const { parser } = useParser()
  const { idl } = parser || {}

  useEffect(() => {
    if (!!idl) return setVisible(true)
    else return setVisible(false)
  }, [idl])

  return (
    <div>
      <div className="flex flex-row gap-4 justify-center">
        <div className="flex-auto">
          <UploadFIle />
        </div>
        {!!idl && (
          <Button
            onClick={() => setVisible(true)}
            preffix={<IonIcon name="print-outline" className="leading-[0]" />}
          />
        )}
      </div>
      <Modal
        className="md:!w-[95%] lg:!w-[900px]"
        visible={visible}
        onClose={() => setVisible(false)}
        closeIcon={<IonIcon name="contract-outline" />}
      >
        <div className="grid grid-cols-1 gap-8">
          <div className="grid xs:grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
            <div className="flex flex-col gap-8 p-4 bg-[#EBEBEB]">
              <ViewUploaded acceptViewProgramAddr />
              <TemplateView />
            </div>
            <InstructionView />
          </div>
          <GenerateInstruction />
        </div>
      </Modal>
    </div>
  )
}
export default UploadIdl
