import { Search } from "lucide-react"
import { useState } from "react"
import AllOrders from "@/components/AllOrders"
import { useOrdersFilters } from "@/hooks/useOrdersFilters"

const Orders = () => {
    const [filtering, setFiltering] = useState("")
    const {status, setFilters} = useOrdersFilters()
    return (
        <>
          <div className="container px-4 mx-auto">
            <div className="mt-6 flex items-center justify-between">
              <h3 className="font-bold">Orders</h3>
              <div className="flex gap-2">
                {/* <CreateBrand trigger={
                  <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                    <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add Brand</span>
                  </button>}
                /> */}
              </div>
            </div>
            <div className="w-full flex flex-wrap items-center justify-between mt-4 gap-2">
              <div className="flex gap-2 flex-wrap">
                <button onClick={()=> {setFilters({status: undefined})}} className={`${!status && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>All</button>
                <button  onClick={()=> { setFilters({ status: "PENDING"})}} className={`${status === "PENDING" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Pending</button>
                <button  onClick={()=> {setFilters({ status: "SHIPPING"})}} className={`${status === "SHIPPING" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Shipping</button>
                <button  onClick={()=> {setFilters({ status: "SHIPPED"})}} className={`${status === "SHIPPED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Shipped</button>
                <button onClick={()=> { setFilters({status: "DELIVERED"})}} className={`${status === "DELIVERED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Delivered</button>
                <button  onClick={()=> { setFilters({status: "CANCELLED"})}} className={`${status === "CANCELLED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Cancelled</button>
                <button  onClick={()=> { setFilters({status: "FAILED"})}} className={`${status === "FAILED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Failed</button>
                <button  onClick={()=> { setFilters({status: "RETURNED"})}} className={`${status === "RETURNED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Returned</button>
              </div>
              <div className="w-full sm:w-[320px]">
                <div className="flex w-full border h-full items-center px-2 py-2 gap-2 rounded-md focus-within:border-gray-500">
                  <Search className="h-5 w-5 text-gray-400 pointer-events-none" />
                  <input type="text" placeholder="Plur 890987645368" onChange={e => setFiltering(e.target.value)} className="outline-none text-sm w-full"/>
                </div>
              </div>
            </div>
    
            <div>
              <AllOrders filtering={filtering} status={status} />
            </div>
          </div>
        </>
      )
}

export default Orders
