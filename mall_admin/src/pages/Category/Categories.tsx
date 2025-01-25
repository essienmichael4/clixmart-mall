import { Plus, Search } from "lucide-react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Category } from "@/lib/types"
import useAxiosToken from "@/hooks/useAxiosToken"
import CategoriesTable from "@/features/CategoriesTable"
import CreateCategory from "./CreateCategory"
import CreateSubCategory from "./CreateSubCategory"

const Categories = () => {
  const [status, setStatus] = useState("")
  const [filtering, setFiltering] = useState("")
  const axios_instance_token = useAxiosToken()

  const categories = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async() => await axios_instance_token.get(`/categories`).then(res => res.data)
  })

  return (
    <>
      <div className="container px-4 mx-auto">
        <div className="mt-6 flex items-center justify-between">
          <h3 className="font-bold">Categories</h3>
          <div className="flex gap-2">
            <CreateCategory trigger={
              <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add Category</span>
              </button>}
            />
            <CreateSubCategory trigger={
              <button className="py-2 px-2 md:px-4 flex items-center rounded-md border border-blue-500 text-blue-500">
                <Plus className="w-4 h-4 mr-2 text-blue-500"/> <span className="text-xs md:text-sm">Add Sub-Category</span>
              </button>}
            />
          </div>
        </div>
        <div className="w-full flex flex-wrap items-center justify-between mt-4 gap-2">
          <div className="flex gap-2 flex-wrap">
            <button onClick={()=> setStatus("")} className={`${status === "" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>All</button>
            <button onClick={()=> setStatus("ON_HOLD")} className={`${status === "ON_HOLD" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>On hold</button>
            <button  onClick={()=> setStatus("EN_ROUTE")} className={`${status === "EN_ROUTE" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>En route</button>
            <button  onClick={()=> setStatus("ARRIVED")} className={`${status === "ARRIVED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Arrived</button>
            <button  onClick={()=> setStatus("DELIVERED")} className={`${status === "DELIVERED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Delivered</button>
          </div>

          <div className="w-full sm:w-[320px]">
            <div className="flex w-full border h-full items-center px-2 py-2 gap-2 rounded-md focus-within:border-gray-500">
              <Search className="h-5 w-5 text-gray-400 pointer-events-none" />
              <input type="text" placeholder="Plur 890987645368" onChange={e => setFiltering(e.target.value)} className="outline-none text-sm w-full"/>
            </div>
          </div>
        </div>

        <div>
          <CategoriesTable categories={categories.data || []} filtering={filtering}/>
        </div>
      </div>
    </>
  )
}

export default Categories
