import { CSSProperties, InputHTMLAttributes, ReactNode } from 'react'

type InputProps = {
  value: string
  onValue: (value: string) => void
  suffix?: ReactNode
  preffix?: ReactNode
  bordered?: boolean
  style?: CSSProperties
  bodyStyle?: CSSProperties
  className?: string
  placeholder?: string
} & InputHTMLAttributes<Element>

const Input = ({
  value,
  bordered = true,
  suffix,
  preffix,
  style,
  bodyStyle,
  onValue,
  className = '',
  placeholder = '',
}: InputProps) => {
  const clnBorder = bordered
    ? 'border border-inherit'
    : 'border-none bg-[#E0E0E0]'
  const cln =
    'flex flex-nowrap justify-between gap-2 rounded-[4px] py-[6px] px-[14px]'

  return (
    <div className={`${cln} ${className} ${clnBorder}`} style={{ ...style }}>
      {preffix}
      <input
        className="flex-auto w-full border-none outline-none bg-inherit"
        style={{
          ...bodyStyle,
        }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValue(e.target.value)}
      />
      {suffix}
    </div>
  )
}

export default Input
