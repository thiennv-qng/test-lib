import { ReactNode } from 'react'

type RadioButtonProps = {
  value: string
  checked?: boolean
  onChange: (val: string) => void
  children?: ReactNode
}
const RadioButton = ({
  value,
  onChange,
  checked = false,
  children,
}: RadioButtonProps) => {
  return (
    <label
      className={`cursor-pointer px-[16px] py-[4px] rounded-[4px] border text-center ${
        checked ? 'border-blue-400 bg-blue-100' : ''
      }`}
    >
      <input
        className="w-0 h-0 opacity-0"
        type="radio"
        value={value}
        onChange={() => onChange(value)}
        name="template_view"
      />
      {children}
    </label>
  )
}

export default RadioButton
