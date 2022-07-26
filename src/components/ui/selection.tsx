import IonIcon from '@sentre/antd-ionicon'
import {
  CSSProperties,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

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
  const wrapperRef = useRef<HTMLDivElement>(null)

  const clnBorder = bordered
    ? 'border border-inherit'
    : 'border-none bg-[#E0E0E0]'
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

  const sortedOptions = useMemo(() => {
    if (selected !== DEFAULT_SELECTED)
      options.sort((a, b) => {
        if (a.value === selected) return -1
        return 1
      })
    return options
  }, [options, selected])

  useEffect(() => {
    const ctxWrapper = wrapperRef.current
    if (!ctxWrapper) return
    document.addEventListener('click', ({ target }) => {
      assertIsNode(target)
      if (!ctxWrapper.contains(target)) setVisible(false)
    })
    return () => document.removeEventListener('click', () => {})
  }, [])

  return (
    <div className="relative flex w-full" style={style} ref={wrapperRef}>
      {/* Show selected */}
      <div
        className={`flex justify-between items-center overflow-hidden w-full p-2 cursor-pointer select-none gap-2 ${clnBorder} ${clnDroped}`}
        onClick={() => setVisible(!visible)}
      >
        <div className="max-w-[90%] whitespace-nowrap overflow-hidden">
          {selected}
        </div>
        <div>{prefix}</div>
      </div>
      {/* Options */}
      {visible && (
        <div
          className={`absolute w-full top-[100%] bg-[#fff] shadow-[0_5px_8px_#0000002e] max-h-[160px] overflow-auto rounded-b-md z-[999999]`}
          style={bodyStyle}
        >
          {sortedOptions.map((option, idx) => (
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
      )}
    </div>
  )
}

export default Selection
