import { forwardRef, ReactNode, useEffect, useRef, useState } from 'react'

export const GroupExpand = () => {}

type ExpandProps = {
  header?: ReactNode
  children?: ReactNode
}
const Expand = forwardRef(({ header, children }: ExpandProps, ref) => {
  const [visible, setVisible] = useState(false)
  const [elmHeigh, setElmHeigh] = useState(0)
  const expandRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!expandRef?.current) return setElmHeigh(0)
    setElmHeigh(expandRef.current.scrollHeight)
  }, [expandRef])

  const style = visible ? { height: elmHeigh, opacity: 1 } : {}

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="cursor-pointer" onClick={() => setVisible(!visible)}>
        {header}
      </div>
      <div
        ref={expandRef}
        className="h-0 opacity-0 transition-all duration-300"
        style={{ ...style }}
      >
        {children}
      </div>
    </div>
  )
})

export default Expand
