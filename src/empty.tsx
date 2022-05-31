import Typography from './typography'
import iconEmpty from './ico-empty.svg'

const Empty = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <img style={{ width: 70 }} src={iconEmpty} alt="empty" />
      </div>
      <Typography>No Data</Typography>
    </div>
  )
}

export default Empty
