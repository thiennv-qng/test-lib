import { InputHTMLAttributes } from 'react'

type SwitchProps = { checked?: boolean } & InputHTMLAttributes<HTMLInputElement>
const Switch = ({ checked = false, ...props }: SwitchProps) => {
  return (
    <label className="flex relative w-[48px] h-[24px]">
      <input
        {...props}
        type="checkbox"
        className="opacity-0 w-0 h-0 peer"
        checked={checked}
      />
      <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#ebebeb] rounded-2xl before:content-[''] before:absolute before:h-[16px] before:w-[16px] before:rounded-full before:left-[4px] before:top-[4px] before:bg-white peer-checked:before:translate-x-[24px] before:transition before:duration-300 peer-checked:before:bg-[#03A326]" />
    </label>
  )
}

export default Switch
