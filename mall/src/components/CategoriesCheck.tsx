import { useQuery } from "@tanstack/react-query"
import { ScrollArea } from "./ui/scroll-area"
import { Category } from "@/lib/types"
import { axios_instance } from "@/api/axios"
import { Checkbox } from "@/components/ui/checkbox"
import { Link } from "react-router-dom"
import { Separator } from "./ui/separator"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Toggle } from "./ui/toggle"

interface CategoriesCheckParams {
    activeCategory: string,
    subCategories: string[],
    secondLevelCategories: string[],
    subCategoriesChange : (value: string)=>void
    secondSubCategoriesChange : (value: string)=>void
}

const CategoriesCheck = ({activeCategory, subCategories, secondLevelCategories, subCategoriesChange, secondSubCategoriesChange}:CategoriesCheckParams) => {
    const [active, setActive] = useState<number | undefined>()
    const [activeSub, setActiveSub] = useState<number | undefined>()

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

    const categories = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: async() => await axios_instance.get(`/categories`).then(res => {
            return res.data
        })
    })

    return (
        <ScrollArea className="hidden lg:block lg:w-[300px] lg:h-96  px-2">
            <h2 className="uppercase text-sm font-semibold">Categories</h2>
            <Separator />
            {
                categories.data?.map(category=>{
                    return <div key={category.id}>
                        <div className="text-nowrap w-full flex-1 flex gap-3 py-1 pl-2  items-center uppercase">
                            {category.imageUrl && <div className="w-5 h-5 rounded-sm overflow-hidden">
                                    <img src={category.imageUrl} className="w-full h-full" alt="" />
                                </div>
                            }
                            <Link to={`/categories/${category.slug}`} className="text-sm ">{category.name}</Link> 
                        </div>
                        {category.subCategories?.length !== 0 && <div className={`${activeCategory==category.slug ? 'block' : 'hidden'} pl-2 bg-slate-50`}>
                            {category.subCategories?.map(sub=>{
                                return (
                                    <div key={sub.id}>
                                        <div className="text-nowrap w-full flex-1 flex gap-1 py-1 items-center">
                                            <Toggle onClick={()=>handleToggleActive(sub.id)} className={`w-6 h-6 rounded-full hover:bg-gray-200 `}>
                                                {active == sub.id ? <ChevronDown className="w-4 h-4"/>: <ChevronRight className="w-4 h-4"/> } 
                                            </Toggle>
                                            <Checkbox id={sub.slug} className="accent-blue-500 w-4 h-4"
                                                checked={subCategories?.includes(sub.subCategoryId)}
                                                onCheckedChange={()=> subCategoriesChange(sub.subCategoryId)}
                                            />
                                            <label
                                                htmlFor={sub.slug}
                                                className="text-xs capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {sub.name}
                                            </label>
                                        </div>
                                        {subCategories?.includes(sub.subCategoryId) && 
                                        <div className={`${active==sub.id ? 'block' : 'hidden'} ml-2 pl-1 bg-slate-200`}>
                                            {sub.secondLevelSubCategories.map(secondSub => {
                                                return (
                                                    <div>
                                                        <div className="text-nowrap w-full flex-1 flex gap-1 py-1 items-center">
                                                            <Toggle onClick={()=>handleToggleActiveSub(secondSub.id)} className={`w-6 h-6 rounded-full hover:bg-gray-300 `}>
                                                                {activeSub == secondSub.id ? <ChevronDown className="w-4 h-4"/>: <ChevronRight className="w-4 h-4"/> } 
                                                            </Toggle>
                                                            <Checkbox id={secondSub.slug} className="accent-blue-500 w-4 h-4"
                                                                checked={secondLevelCategories?.includes(secondSub.secondLevelSubCategoryId)}
                                                                onCheckedChange={()=> {
                                                                    if(subCategories.includes(sub.subCategoryId)){
                                                                        secondSubCategoriesChange(secondSub.secondLevelSubCategoryId)
                                                                        return
                                                                    } else{
                                                                        subCategoriesChange(sub.subCategoryId) 
                                                                        secondSubCategoriesChange(secondSub.secondLevelSubCategoryId)
                                                                    }
                                                                }}
                                                            />
                                                            <label
                                                                htmlFor={secondSub.slug}
                                                                className="text-xs capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                            >
                                                                {secondSub.name}
                                                            </label>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        }
                                    </div>
                                )
                            })}
                        </div>}
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

export default CategoriesCheck
