import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'
import IonIcon from '@sentre/antd-ionicon'

export const GroupExpand = () => {}

type ExpandProps = {
  header?: ReactNode
  children?: ReactNode
  arrowIcon?: ReactNode
  expandIcon?: ReactNode
  headerStyle?: CSSProperties
}
const Expand = ({
  header,
  children,
  arrowIcon = <IonIcon name="chevron-down-outline" className="!text-white" />,
  expandIcon = <IonIcon name="chevron-up-outline" className="!text-white" />,
  headerStyle,
}: ExpandProps) => {
  const [visible, setVisible] = useState(false)
  const [elmHeigh, setElmHeigh] = useState(0)
  const expandRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!expandRef?.current) return setElmHeigh(0)
    setElmHeigh(expandRef.current.scrollHeight)
  }, [expandRef])

  const style = visible ? { height: elmHeigh, opacity: 1 } : {}

  return (
    <div className="grid grid-cols-1">
      <div
        style={headerStyle}
        className="cursor-pointer py-[8px] px-[16px] bg-[#213565]"
        onClick={() => setVisible(!visible)}
      >
        {header && (
          <div className="flex flex-row justify-between items-center gap-2">
            {header}
            {visible ? expandIcon : arrowIcon}
          </div>
        )}
      </div>
      <div
        ref={expandRef}
        className="h-20 opacity-50 transition-all duration-300 overflow-hidden"
        style={{ ...style }}
      >
        {children}
      </div>
    </div>
  )
}

export default Expand
