import {useEditor, EditorContent} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Toolbars from "./Toolbars"
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

interface Props {
    onChange: (richText: string)=> void
}

const Tiptap = ({ onChange }: Props) => {
    const editor = useEditor({
        extensions: [StarterKit.configure(), Underline, TextAlign.configure({
            types: ['heading', 'paragraph'],
          })],
        content: "",
        editorProps: {
            attributes: {
                class: "rounded-md border min-h-[250px] border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            }
        }, onUpdate({editor}){
            onChange(editor.getHTML())
        }
    })

    return (
        <div className="flex flex-col justify-center gap-2">
            <Toolbars editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

export default Tiptap
