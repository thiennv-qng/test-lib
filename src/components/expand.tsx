import { ReactNode, useEffect, useRef, useState } from 'react'

export const GroupExpand = () => {}

type ExpandProps = {
  header?: ReactNode
  children?: ReactNode
}
const Expand = ({ header, children }: ExpandProps) => {
  const [visible, setVisible] = useState(false)
  const [elmHeigh, setElmHeigh] = useState(0)
  const expandRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!expandRef?.current) return setElmHeigh(0)
    setElmHeigh(expandRef.current.scrollHeight)
  }, [expandRef])

  const style = visible ? { height: elmHeigh, opacity: 1 } : {}

  return (
    <div className="grid grid-cols-1 gap-1">
      <div className="cursor-pointer" onClick={() => setVisible(!visible)}>
        {header}
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
