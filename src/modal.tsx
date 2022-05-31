import Dialog, { DialogProps } from 'rc-dialog'

import 'rc-dialog/assets/index.css'

const Modal = (props: DialogProps) => (
  <Dialog {...props}>{props.children}</Dialog>
)

export default Modal
