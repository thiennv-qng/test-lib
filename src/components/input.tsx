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
}: InputProps) => {
  const clnBorder = bordered
    ? 'border border-inherit rounded-[8px] py-[6px] px-[14px]'
    : 'border-none'
  const cln = 'flex flex-nowrap justify-between gap-2'

  return (
    <div className={`${cln} ${className} ${clnBorder}`} style={{ ...style }}>
      {preffix}
      <input
        className="flex-auto w-full border-none outline-none bg-inherit"
        style={{
          ...bodyStyle,
        }}
        value={value}
        onChange={(e) => onValue(e.target.value)}
      />
      {suffix}
    </div>
  )
}

export default Input
