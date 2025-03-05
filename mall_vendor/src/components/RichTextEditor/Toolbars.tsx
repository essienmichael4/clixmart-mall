import { TaskType, tools } from "@/constants"
import { ChainedCommands, Editor } from "@tiptap/react"
import IconButton from "./IconButton"

interface Props {
    editor: Editor | null
}

const chainMethods = (editor:Editor | null, command: (chain:ChainedCommands)=>ChainedCommands) => {
    if(!editor) return
    return command(editor.chain().focus()).run()
}

const Toolbars = ({editor}:Props) => {
    if(!editor) return null
    
    const handleOnClick = (task:TaskType)=>{
        switch(task){
            case "bold":
                return chainMethods(editor, chain => chain.toggleBold())
            case "italic":
                return chainMethods(editor, chain => chain.toggleItalic())
            case "underline":
                return chainMethods(editor, chain => chain.toggleUnderline())
            case "strike":
                return chainMethods(editor, chain => chain.toggleStrike())
            case "bulletList":
                return chainMethods(editor, chain => chain.toggleBulletList())
            case "orderedList":
                return chainMethods(editor, chain => chain.toggleOrderedList())
            case "left":
                return chainMethods(editor, chain => chain.setTextAlign("left"))
            case "center":
                return chainMethods(editor, chain => chain.setTextAlign("center"))
            case "right":
                return chainMethods(editor, chain => chain.setTextAlign("right"))
            case "heading":
                return chainMethods(editor, chain => chain.toggleHeading({level: 2}))
        }
    }

    return (
        <div className="border border-input bg-transparent rounded-md space-x-1 p-1">
            {tools.map(({icon, task})=>{                
                return <IconButton key={task}
                  active={editor.isActive(task) || editor.isActive({textAlign: task})}
                  onClick={()=>handleOnClick(task)}
                  > {icon} </IconButton>
            })}
        </div>
    )
}

export default Toolbars
