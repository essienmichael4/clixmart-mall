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
                class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none"
            }
        }, onUpdate({editor}){
            onChange(editor.getHTML())
        }
    })

    return (
        <div className="flex flex-col justify-center gap-2">
            <Toolbars editor={editor} />
            <EditorContent editor={editor} className="border rounded-lg"/>
        </div>
    )
}

export default Tiptap
