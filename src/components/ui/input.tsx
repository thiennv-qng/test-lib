import React, { CSSProperties, InputHTMLAttributes, ReactNode } from 'react'

type InputProps = {
  value?: string
  suffix?: ReactNode
  preffix?: ReactNode
  bordered?: boolean
  style?: CSSProperties
  bodyStyle?: CSSProperties
  className?: string
  placeholder?: string
} & InputHTMLAttributes<HTMLInputElement>

const Input = ({
  value = '',
  bordered = true,
  suffix,
  preffix,
  style,
  bodyStyle,
  className = '',
  placeholder = '',
  ...props
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
        {...props}
      />
      {suffix}
    </div>
  )
}

export default Input
