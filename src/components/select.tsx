import React, { CSSProperties, ReactNode } from 'react'
import { SelectHTMLAttributes } from 'react'

type SelectProps = {
  bordered?: boolean
  style?: CSSProperties
  className?: string
  children?: ReactNode
  onValue: (value: string) => void
} & SelectHTMLAttributes<Element>

const Select = ({
  bordered = true,
  className = '',
  style,
  children,
  onValue,
  ...props
}: SelectProps) => {
  const cln = bordered ? `border ${className} ` : className
  return (
    <select
      onChange={(e) => onValue(e.target.value)}
      className={cln + 'rounded-[4px] px-[8px] bg-[#E0E0E0]'}
      style={{ ...style }}
      {...props}
    >
      {children}
    </select>
  )
}

export default Select
