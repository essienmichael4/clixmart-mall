import AllOrders from "@/components/AllOrders"
import { useOrdersFilters } from "@/hooks/useOrdersFilters"
import { Search } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router-dom"

const Orders = () => {
    const [filtering, setFiltering] = useState("")
    const {status, setFilters} = useOrdersFilters()
    const {store} = useParams()
    
    return (
        <>
            <div className="container px-4 mx-auto">
                <div className="mt-6 flex items-center gap-2 justify-between">
                    <h3 className="font-bold text-nowrap">Your Ordered Items</h3>
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
                <AllOrders filtering={filtering} store={store} status={status} />
                </div>
            </div>
        </>
    )
}

export default Orders
