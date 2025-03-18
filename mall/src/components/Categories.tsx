import { useQuery } from "@tanstack/react-query"
import { ScrollArea } from "./ui/scroll-area"
import { Category } from "@/lib/types"
import { axios_instance } from "@/api/axios"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Toggle } from "@radix-ui/react-toggle"
import { Link } from "react-router-dom"

const Categories = () => {
    const [active, setActive] = useState<number | undefined>()
    const categories = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: async() => await axios_instance.get(`/categories`).then(res => {
            return res.data
        })
    })

    const handleToggleActive = (value:number)=>{
        if(active == value){
            setActive(undefined)
        }else{
            setActive(value)
        }
    }

    return (
        <ScrollArea className="hidden lg:block lg:w-[300px] lg:h-96">
            <h2 className="uppercase text-sm font-semibold">Our Categories</h2>
            {
                categories.data?.map(category=>{
                    return <div key={category.id}>
                        <div className="text-nowrap w-full flex-1 flex gap-3 py-1 pl-2  items-center uppercase">
                            <Toggle onClick={()=>handleToggleActive(category.id)} className={`p-1 rounded-full hover:bg-gray-100 `}>
                            {active == category.id ? <ChevronDown className="w-4 h-4"/>: <ChevronRight className="w-4 h-4"/> } 
                            </Toggle>
                            <Link to={`/categories/${category.slug}`} className="text-sm ">{category.name}</Link> 
                        </div>
                        <div className={`${active==category.id ? 'block' : 'hidden'} pl-10 bg-slate-50`}>
                            {category.subCategories?.map(sub=>{
                                return <Link to={`/categories/${category.slug}/${sub.slug}`} className="text-xs capitalize py-1 text-nowrap" key={sub.id}>
                                    {sub.name}
                                </Link>
                            })}
                        </div>
                    </div>
                })
            }
        </ScrollArea>
  )
}

export default Categories