import { useEffect } from 'react'

import { Switch } from 'components'

type BoolInputProps = {
  onChange: (val: string) => void
  value?: string
}
const BoolInput = ({ value, onChange }: BoolInputProps) => {
  const checked = value === 'true' ? true : false

  useEffect(() => {
    if (value === '' || value === undefined) onChange('false')
  }, [onChange, value])

  return (
    <div className="p-4 rounded-[4px] shadow-[0_0_8px_#181c3630]">
      <Switch
        checked={checked}
        onChange={(e) => onChange(JSON.stringify(e.target.checked))}
      />
    </div>
  )
}
export default BoolInput
