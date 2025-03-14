import parse from 'html-react-parser'
interface DescriptionParserProps {
    description:string
}

const DescriptionParser = ({description}:DescriptionParserProps) => {
  return (
    <div className="rounded-md min-h-[250px] border-input bg-transparent py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
        {parse(description)}
    </div>
  )
}

export default DescriptionParser
