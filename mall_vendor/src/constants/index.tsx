import { Bold, Heading2, Italic, List, ListOrdered, MoveLeft, MoveRight, MoveVertical, Strikethrough, Underline } from "lucide-react";

export type TaskType = (typeof tools)[number]["task"]
export const tools = [
  { task: "heading", icon: <Heading2 size={20}/>},
  { task: "bold", icon: <Bold size={20}/>},
  { task: "italic", icon: <Italic size={20}/>},
  { task: "underline", icon: <Underline size={20}/>},
  { task: "strike", icon: <Strikethrough size={20}/>},
  { task: "bulletList", icon: <List size={20}/>},
  { task: "orderedList", icon: <ListOrdered size={20}/>},
  { task: "left", icon: <MoveLeft size={20}/>},
  { task: "center", icon: <MoveVertical size={20}/>},
  { task: "right", icon: <MoveRight size={20}/>},
] as const
