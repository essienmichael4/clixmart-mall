import { useQuery } from "@tanstack/react-query"
import { ScrollArea } from "./ui/scroll-area"
import { Category } from "@/lib/types"
import { axios_instance } from "@/api/axios"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Toggle } from "@radix-ui/react-toggle"
import { Link } from "react-router-dom"
import { Separator } from "./ui/separator"

const Categories = () => {
    const [active, setActive] = useState<number | undefined>()
    const [activeSub, setActiveSub] = useState<number | undefined>()
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

    const handleToggleActiveSub = (value:number)=>{
        if(activeSub == value){
            setActiveSub(undefined)
        }else{
            setActiveSub(value)
        }
    }

    return (
        <ScrollArea className="hidden lg:block lg:w-[280px] lg:h-96">
            <h2 className="uppercase text-sm font-semibold">Our Categories</h2>
            {
                categories.data?.map(category=>{
                    return <div key={category.id}>
                        <div className="text-nowrap w-full flex-1 flex gap-3 py-1 pl-2  items-center uppercase">
                            <Toggle onClick={()=>handleToggleActive(category.id)} className={`p-1 rounded-full hover:bg-gray-100 `}>
                            {active == category.id ? <ChevronDown className="w-4 h-4"/>: <ChevronRight className="w-4 h-4"/> } 
                            </Toggle>
                            {category.imageUrl && <div className="w-5 h-5 rounded-sm overflow-hidden">
                                    <img src={category.imageUrl} className="w-full h-full" alt="" />
                                </div>
                            }
                            <Link to={`/categories/${category.slug}`} className="text-sm ">{category.name}</Link> 
                        </div>
                        <div className={`${active==category.id ? 'block' : 'hidden'} pl-4 bg-slate-50`}>
                            {category.subCategories?.map(sub=>{
                                return (
                                    <div>
                                        <div className="text-nowrap w-full flex-1 flex gap-3 py-1 pl-2  items-center">
                                            <Toggle onClick={()=>handleToggleActiveSub(sub.id)} className={`p-1 rounded-full hover:bg-gray-300 `}>
                                                {activeSub == sub.id ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/> } 
                                            </Toggle>
                                            <Link to={`/categories/${category.slug}?sub-categories=${sub.subCategoryId}`} className="text-xs block capitalize py-1 text-nowrap" key={sub.id}>
                                                {sub.name}
                                            </Link>
                                        </div>
                                        <div className={`${activeSub==sub.id ? 'block' : 'hidden'} ml-2 pl-4 bg-slate-200`}>
                                            {sub.secondLevelSubCategories.map(secondSub => {
                                                return (
                                                    <div>
                                                        <Link to={`/categories/${category.slug}?sub-categories=${sub.subCategoryId}&second-level-categories=${secondSub.secondLevelSubCategoryId}`} className="text-xs block capitalize py-1 text-nowrap" key={sub.id}>
                                                            {secondSub.name}
                                                        </Link>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                })
            }
            <Separator className="my-2 md:hidden lg:block xl:hidden"/>
            <div className="md:hidden lg:block xl:hidden">
                <a className="text-sm" target='_blank' href='https://vendor.clixmartonline.com'>Sell on Clixmart</a>
            </div>
        </ScrollArea>
  )
}

export default Categories
