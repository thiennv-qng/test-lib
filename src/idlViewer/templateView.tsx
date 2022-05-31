import RadioButton from 'components/radioButton'
import { useState } from 'react'

import { useParser } from '../providers/parser.provider'

const TemplateView = () => {
  const [value, setValue] = useState('')
  const { parser, setInstruction } = useParser()
  const { idl } = parser || {}

  const onChange = (val: string) => {
    setValue(val)
    return setInstruction(val)
  }

  return (
    <div className="grid gap-4 xs:grid-cols-1 md:grid-cols-2">
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
