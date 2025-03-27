import { useQuery } from "@tanstack/react-query"
import { ScrollArea } from "./ui/scroll-area"
import { Category } from "@/lib/types"
import { axios_instance } from "@/api/axios"
import { Checkbox } from "@/components/ui/checkbox"
import { Link } from "react-router-dom"
import { Separator } from "./ui/separator"

interface CategoriesCheckParams {
    activeCategory: string,
    subCategories: string[],
    subCategoriesChange : (value: string)=>void
}

const CategoriesCheck = ({activeCategory, subCategories, subCategoriesChange}:CategoriesCheckParams) => {
    // console.log(subCategories);
    
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
                            <Link to={`/categories/${category.slug}`} className="text-sm ">{category.name}</Link> 
                        </div>
                        {category.subCategories?.length !== 0 && <div className={`${activeCategory==category.slug ? 'block' : 'hidden'} py-2 pl-2 bg-slate-50`}>
                            {category.subCategories?.map(sub=>{
                                return <div className="flex items-center py-1 space-x-2">
                                    <Checkbox id={sub.slug} className="accent-blue-500 w-4 h-4"
                                        checked={subCategories?.includes(sub.subCategoryId)}
                                        onCheckedChange={()=> subCategoriesChange(sub.subCategoryId)}
                                    />
                                    <label
                                        htmlFor={sub.slug}
                                        className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {sub.name}
                                    </label>
                                </div>
                            })}
                        </div>}
                    </div>
                })
            }
        </ScrollArea>
  )
}

export default CategoriesCheck
