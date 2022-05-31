import Button from './button'
import { useParser } from './providers/parser.provider'

const TemplateView = () => {
  const {
    parser: { idl },
    setInstruction,
  } = useParser()

  return (
    <div className="grid gap-4 xs:grid-cols-1 md:grid-cols-2">
      {idl?.instructions.map((instruc, idx) => (
        <Button onClick={() => setInstruction(instruc.name)} block key={idx}>
          {instruc.name}
        </Button>
      ))}
    </div>
  )
}

export default TemplateView
