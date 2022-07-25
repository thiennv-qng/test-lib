import IonIcon from '@sentre/antd-ionicon'
import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'

import Typography from './typography'

const DEFAULT_SELECTED = 'Default'
export const DUMMY_OPTION_VALUE = {
  label: DEFAULT_SELECTED,
  value: DEFAULT_SELECTED,
}

export type Option = { label: string; value: string }
type SelectionProps = {
  options: Option[]
  onSelected?: (selected: string) => void
  selected?: string
  bordered?: boolean
  prefix?: ReactNode
  style?: CSSProperties
  bodyStyle?: CSSProperties
}

const Selection = ({
  options,
  onSelected = () => {},
  bordered = false,
  selected = DEFAULT_SELECTED,
  prefix = <IonIcon name="chevron-down-outline" />,
  bodyStyle,
  style,
}: SelectionProps) => {
  const [visible, setVisible] = useState(false)
  const optionRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const clnBorder = bordered
    ? 'border border-inherit'
    : 'border-none bg-[#E0E0E0]'
  const hidden = !visible ? 'hidden' : ''
  const clnDroped = visible ? 'rounded-t-md' : 'rounded-md'

  const onClick = (val: string) => {
    setVisible(false)
    return onSelected(val)
  }

  function assertIsNode(e: EventTarget | null): asserts e is Node {
    if (!e || !('nodeType' in e)) {
      throw new Error(`Node expected`)
    }
  }

  useEffect(() => {
    const ctxOption = optionRef.current
    const ctxWrapper = wrapperRef.current
    if (!ctxWrapper || !ctxOption) return
    document.addEventListener('click', ({ target }) => {
      assertIsNode(target)
      if (!ctxOption.contains(target) && !ctxWrapper.contains(target)) {
        setVisible(false)
      }
    })
    return () => document.removeEventListener('click', () => {})
  }, [])

  return (
    <div className="relative flex w-full" style={style}>
      {/* Show selected */}
      <div
        className={`flex justify-between items-center overflow-hidden w-full p-2 cursor-pointer select-none gap-2 ${clnBorder} ${clnDroped}`}
        onClick={() => setVisible(!visible)}
        ref={wrapperRef}
      >
        <div className="max-w-[90%] whitespace-nowrap overflow-hidden">
          {selected}
        </div>
        <div>{prefix}</div>
      </div>
      {/* Options */}
      <div
        className={`absolute w-full top-[100%] bg-[#fff] shadow-[0_5px_8px_#0000002e] max-h-[160px] overflow-auto rounded-b-md ${hidden} z-[999999]`}
        style={bodyStyle}
        ref={optionRef}
      >
        {options.map((option, idx) => (
          <div
            className={`w-full p-2 cursor-pointer select-none last:rounded-b-md hover:bg-[#f5f5f5] hover:text-black overflow-hidden ${
              selected === option.value ? 'bg-[#605ece] text-white' : ''
            }`}
            key={idx}
            onClick={() => onClick(option.value)}
          >
            <Typography style={{ whiteSpace: 'nowrap' }}>
              {option.label}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Selection
