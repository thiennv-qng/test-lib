import { CSSProperties, ReactNode } from 'react'

type TooltipProps = {
  title: string | ReactNode
  description: string | ReactNode
  children: ReactNode
  width?: number | string
  bodyStyle?: CSSProperties
}
const Tooltip = ({
  title,
  description,
  children,
  width = 150,
  bodyStyle = {},
}: TooltipProps) => {
  return (
    <span className="relative group">
      {children}
      <div
        style={{ background: '#fff', ...bodyStyle, width: width }}
        className="absolute hidden group-hover:grid grid-cols-1 p-3 gap-0 rounded-md before:relative before:content-[''] before:w-0 before:h-0 before:border-l-[5px] before:border-l-[transparent] before:border-r-[5px] before:border-r-[transparent] before:border-b-[5px] before:border-b-[#fff] before:border-solid before:top-[-16px] before:left-[25%]"
      >
        {title}
        {description}
      </div>
    </span>
  )
}

export default Tooltip
