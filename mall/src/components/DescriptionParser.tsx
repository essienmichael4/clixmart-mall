import parse from 'html-react-parser'
interface DescriptionParserProps {
    description:string
}

const DescriptionParser = ({description}:DescriptionParserProps) => {
  return (
    <div 
    className="prose prose-sm mt-3 focus:outline-none"
    >
        {parse(description)}
    </div>
  )
}

export default DescriptionParser
