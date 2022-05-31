import { useEffect, useState } from 'react'

import InstructionView from './instrctionView'
import Modal from './modal'
import TemplateView from './templateView'
import { UploadFile, UploadIdl } from './upload'

import { useParser } from './providers/parser.provider'
import GenerateInstruction from 'generateInstruction'

const App = () => {
  const { parser, removeIdl } = useParser()
  const { idl } = parser || {}
  const [visible, setVisible] = useState(false)

  const onClose = () => {
    setVisible(false)
    removeIdl()
  }

  useEffect(() => {
    if (!!idl) return setVisible(true)
    else return setVisible(false)
  }, [idl])

  return (
    <div>
      <UploadIdl />
      <Modal
        className="!sm:w-full !lg:w-[900px]"
        width={900}
        visible={visible}
        onClose={onClose}
        closable={false}
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="grid xs:grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
            <div className="flex flex-col gap-5">
              <div className="bg-slate-50 p-4">
                <UploadFile />
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

export default App
