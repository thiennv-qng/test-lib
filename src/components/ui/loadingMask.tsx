import { Spinner } from './button'

const LoadingMask = () => {
  return (
    <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full backdrop-blur-sm">
      <Spinner />
    </div>
  )
}

export default LoadingMask
