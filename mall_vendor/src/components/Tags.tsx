import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom"

const TAGLENGTH = 10

interface ITagsProps{
    tag:string,
    tags:string[],
    handleChange:(e: React.ChangeEvent<HTMLInputElement>)=>void,
    handleKeyDown:(e: React.KeyboardEvent<HTMLInputElement>)=>void,
    removeTag:(index:number)=>void
}

const Tags = ({handleChange, tag, tags, handleKeyDown, removeTag} :ITagsProps) => {
  const navigate = useNavigate()

  const handleSearch = ()=>{
    if(tag && tags.length < TAGLENGTH){
      tags.push(tag.trim())
    }

    if(tags.length === 0) return

    navigate("/search", {state:tags})
  }

  return (
    <div className="w-full  flex flex-col px-1 gap-1 mt-16 rounded-lg">
      <div className="flex gap-1">
        {tags.map(( tag, index )=>(
            <div key={index} className="px-2 flex gap-1 items-center text-xs py-1 bg-gray-200 rounded-full">
                {tag} <button onClick={()=>removeTag(index)} className="bg-gray-700 h-4 w-4 rounded-full text-xs text-white flex items-center justify-center">
                  x
                </button>
            </div>
        ) )}
      </div>
      <div className="w-full rounded-md flex  flex-col h-14 space-y-1">
        <label className="text-xs">Product tags</label>
        <div className="flex w-full  border h-full items-center px-3 gap-3 rounded-md focus-within:border-gray-500">
          <input type="text" onChange={handleChange}
            onKeyDown={handleKeyDown}
            value={tag} placeholder="Vintage, cotton, summer" className="outline-none w-full bg-white"/>
        </div>
      </div>
      <p className="text-xs text-start">Enter product tags in the input above seperated by , or enter or tab. (Max of 10 tags)</p>
    </div>
  )
}

export default Tags
