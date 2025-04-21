import { Search } from "lucide-react"
import { useState } from "react"
// import { useParams } from "react-router-dom"
import AllProducts from "@/components/AllProducts"
import { useProductFilters } from "@/hooks/useProductFilters"
// import CreateProductDialog from "./CreateProductDialog"

const Products = () => {
  // const {store} = useParams()
  // const [status, setStatus] = useState("")
  // const [reviewStatus, setReviewStatus] = useState("")
  const {status, review, setFilters} = useProductFilters()
  const [filtering, setFiltering] = useState("")

  return (
    <>
      <div className="container px-4 mx-auto">
        <div className="mt-6 flex items-center gap-2 justify-between">
          {/* <h3 className="font-bold text-nowrap">All Products</h3> */}
            {/* <CreateProductDialog store={store as string} trigger={
              <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add Product</span>
              </button>
            }/> */}
        </div>
        <div className="w-full flex flex-wrap">
          <div className='w-full sm:w-1/2 lg:w-1/3 px-2 py-2'>
            <div className="border p-4 rounded-lg">
              <div>
                <h3 className="text-xs font-semibold">Total Products</h3>
              </div>
              <div className="flex">
                <div>
                  <div className="flex gap-2 my-2 items-center">
                    <p className="text-lg">0</p>
                    <span className="text-xs p-1 border rounded-full">+0 products</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Compared to last week</p>
                </div>
                <div></div>
              </div>
            </div>
          </div>
          <div className='w-full sm:w-1/2 lg:w-1/3 px-2 py-2'>
            <div className="border p-4 rounded-lg">
              <div>
                <h3 className="text-xs font-semibold">Product Revenue</h3>
              </div>
              <div className="flex">
                <div>
                  <div className="flex gap-2 my-2 items-center">
                    <p className="text-lg">0</p>
                    <span className="text-xs p-1 border rounded-full">+0%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Compared to last week</p>
                </div>
                <div></div>
              </div>
            </div>
          </div>
          <div className='w-full sm:w-1/2 lg:w-1/3 px-2 py-2'>
            <div className="border p-4 rounded-lg">
              <div>
                <h3 className="text-xs font-semibold">Product Sold</h3>
              </div>
              <div className="flex">
                <div>
                  <div className="flex gap-2 my-2 items-center">
                    <p className="text-lg">0</p>
                    <span className="text-xs p-1 border rounded-full">+0%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Compared to last week</p>
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
          
        <div className="mt-4 flex flex-wrap justify-between items-center">
              
          <div className="flex gap-2 flex-wrap">
            <button onClick={()=> {setFilters({review: undefined, status: undefined})}} className={`${!status && !review && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>All</button>
            <div className="h-8 w-[1px] bg-gray-500"></div>
            <button  onClick={()=> {review === "PENDING" ? setFilters({review: undefined, status}) : setFilters({review: "PENDING", status})}} className={`${review === "PENDING" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Pending</button>
            <button  onClick={()=> {review === "APPROVED" ? setFilters({review: undefined, status}) : setFilters({review: "APPROVED", status})}} className={`${review === "APPROVED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Approved</button>
            <button  onClick={()=> {review === "REJECTED" ? setFilters({review: undefined, status}) : setFilters({review: "REJECTED", status})}} className={`${review === "REJECTED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Rejected</button>
            <div className="h-8 w-[1px] bg-gray-500"></div>
            <button onClick={()=> {status === "DRAFT" ? setFilters({status: undefined, review}) : setFilters({status: "DRAFT", review})}} className={`${status === "DRAFT" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Draft</button>
            <button  onClick={()=> {status === "PUBLISH" ? setFilters({status: undefined, review}) : setFilters({status: "PUBLISH", review})}} className={`${status === "PUBLISH" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Published</button>
            <button  onClick={()=> {status === "ARCHIVE" ? setFilters({status: undefined, review}) : setFilters({status: "ARCHIVE", review})}} className={`${status === "ARCHIVE" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Archived</button>
          </div>

          <div className="w-full sm:w-[320px] mt-2 xl:mt-0">
            <div className="flex w-full border h-full items-center px-2 py-2 gap-2 rounded-md focus-within:border-gray-500">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
              <input type="text" placeholder="Plur 890987645368" onChange={e => setFiltering(e.target.value)} className="outline-none text-xs sm:text-sm w-full"/>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <AllProducts status={status} review={review} filtering={filtering} />
          {/* <div className="w-full columns-2 sm:columns-3 lg:column-4 gap-4">
              <div className='w-full break-inside-avoid'>
                  <div className="flex flex-col items-center justify-center gap-4 rounded-md p-6 text-md border border-neutral-300">
                    <Plus />
                    <p className="text-xs">Add Product</p>
                  </div>
              </div>
          </div> */}
        </div>
      </div>
    </>
  )
}

export default Products
