import AllOrders from "@/components/AllOrders"
import { Search } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router-dom"

const Orders = () => {
    const [filtering, setFiltering] = useState("")
    const {store} = useParams()
    
    return (
        <>
            <div className="container px-4 mx-auto">
                <div className="mt-6 flex items-center gap-2 justify-between">
                    <h3 className="font-bold text-nowrap">Your Ordered Items</h3>
                </div>
                <div className="w-full flex flex-wrap items-center justify-between mt-4 gap-2">
                <div className="w-full sm:w-[320px]">
                    <div className="flex w-full border h-full items-center px-2 py-2 gap-2 rounded-md focus-within:border-gray-500">
                    <Search className="h-5 w-5 text-gray-400 pointer-events-none" />
                    <input type="text" placeholder="Plur 890987645368" onChange={e => setFiltering(e.target.value)} className="outline-none text-sm w-full"/>
                    </div>
                </div>
                </div>
                <div>
                <AllOrders filtering={filtering} store={store} />
                </div>
            </div>
        </>
    )
}

export default Orders
