import { useState } from 'react'

import { RadioButton } from 'components'

import { useParser } from '../providers/parser.provider'

const TemplateView = () => {
  const { parser, setInstruction } = useParser()
  const { idl, ixSelected: instructionSelected } = parser || {}
  const [value, setValue] = useState(instructionSelected)

  const onChange = (val: string) => {
    setValue(val)
    return setInstruction(val)
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      {idl?.instructions.map((instruc, idx) => (
        <RadioButton
          value={instruc.name}
          onChange={onChange}
          checked={value === instruc.name}
          key={idx}
        >
          {instruc.name}
        </RadioButton>
      ))}
    </div>
  )
}

export default TemplateView
