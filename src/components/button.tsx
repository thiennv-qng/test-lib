import { CSSProperties, ReactNode } from 'react'

type ButtonTypes = 'default' | 'dashed' | 'primary' | 'text'
type ButtonProps = {
  loading?: boolean
  disabled?: boolean
  size?: number
  type?: ButtonTypes
  suffix?: ReactNode
  preffix?: ReactNode
  children?: ReactNode
  style?: CSSProperties
  block?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const BORDER_RADIUS = 8

const BUTTON_TYPE: Record<ButtonTypes, CSSProperties> = {
  dashed: { borderStyle: 'dashed', borderRadius: BORDER_RADIUS },
  default: { borderStyle: 'solid', borderRadius: BORDER_RADIUS },
  text: { borderStyle: 'none', padding: 0, background: 'transparent' },
  primary: { borderStyle: 'solid', borderRadius: BORDER_RADIUS },
}

export const Spinner = ({ size = 24 }: Partial<ButtonProps>) => {
  return (
    <div style={{ width: size, height: size }}>
      <svg className="spinner" viewBox="0 0 50 50">
        <circle
          className="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        ></circle>
      </svg>
    </div>
  )
}

const Button = ({
  loading = false,
  disabled = false,
  size = 24,
  suffix,
  preffix,
  children,
  type = 'default',
  style,
  block = false,
  onClick = () => {},
}: ButtonProps) => {
  const disabledBtn = loading || disabled
  const width = block ? { width: '100%' } : {}
  const btnStyle = { ...BUTTON_TYPE[type], ...width, ...style }

  return (
    <button
      className={`flex flex-row justify-center align-middle gap-2 py-2 px-4 rounded-[4px] font-medium border border-[#473C31] ${
        type === 'primary' ? 'bg-[#1866E1] text-white border-none' : ''
      }`}
      onClick={(e) => onClick(e)}
      style={btnStyle}
      disabled={disabledBtn}
    >
      {loading && <Spinner size={size} />}
      {suffix}
      {children}
      {preffix}
    </button>
  )
}

export default Button
