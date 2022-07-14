import { CSSProperties, ReactNode } from 'react'
import { SelectHTMLAttributes } from 'react'

type SelectProps = {
  bordered?: boolean
  style?: CSSProperties
  className?: string
  children?: ReactNode
  suffix?: ReactNode
  extra?: ReactNode
} & SelectHTMLAttributes<HTMLSelectElement>

const Select = ({
  bordered = true,
  className = '',
  style,
  children,
  suffix,
  extra,
  ...props
}: SelectProps) => {
  const cln = bordered ? `border ${className} ` : className
  return (
    <div
      className={
        cln + 'flex flex-row rounded-[4px] px-[8px] bg-[#E0E0E0] gap-2'
      }
    >
      {suffix}
      <select
        style={{ ...style }}
        className="bg-transparent outline-none w-full"
        {...props}
      >
        {children}
      </select>
      {extra}
    </div>
  )
}

export default Select
