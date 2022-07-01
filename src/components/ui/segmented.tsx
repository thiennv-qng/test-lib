type SegmentedProps = {
  options: string[]
  value: string
  onChange: (value: string) => void
}

const Segmented = ({ options, value, onChange }: SegmentedProps) => {
  return (
    <div className="sntr-segmented">
      <div className="sntr-segmented-group">
        <div className="sntr-segmented-thumb active" />
        {options.map((option, idx) => {
          const checked = option === value
          return (
            <label
              className={`sntr-segmented-item${
                checked ? ' sntr-segmented-item-selected' : ''
              }`}
              key={idx}
            >
              <input
                type="radio"
                className="sntr-segmented-item-input"
                value={option}
                checked={checked}
                onChange={(e) => onChange(e.target.value)}
                name="sntr-segmented"
              />
              <div className="sntr-segmented-item-label">{option}</div>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default Segmented
