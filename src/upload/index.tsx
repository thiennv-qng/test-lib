import { useEffect, useState } from 'react'

import TemplateView from '../idlViewer/templateView'
import UploadFIle from './uploadFile'
import ViewUploaded from './viewUploaded'
import Modal from '../components/modal'

import { useParser } from '../providers/parser.provider'
import InstructionView from 'idlViewer/instructionView'
import GenerateInstruction from 'generateInstruction'

const UploadIdl = () => {
  const [visible, setVisible] = useState(false)
  const { parser, removeIdl, txInstructions } = useParser()
  const { idl } = parser || {}

  const onClose = () => {
    setVisible(false)
    removeIdl()
  }

  useEffect(() => {
    if (!!idl) return setVisible(true)
    else return setVisible(false)
  }, [idl])
  console.log(txInstructions, 'txInstructions')

  return (
    <div>
      <UploadFIle />
      <Modal
        width={900}
        className="!sm:w-full !lg:w-[900px]"
        visible={visible}
        onClose={onClose}
        closable={false}
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="grid xs:grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
            <div className="flex flex-col gap-5">
              <div className="bg-slate-50 p-4">
                <ViewUploaded />
              </div>
              <div className="bg-slate-50 p-4 h-full">
                <TemplateView />
              </div>
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
