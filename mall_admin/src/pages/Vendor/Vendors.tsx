import AllVendors from "@/components/AllVendors"
import { Search } from "lucide-react"
// import CreatePackage from "./CreatePackage"
import { useState } from "react"

const Vendors = () => {
  const [status, setStatus] = useState("")
  const [filtering, setFiltering] = useState("")

  return (
    <>
      <div className="container px-4 mx-auto">
        <div className="w-full flex flex-wrap">
          <div className='w-full sm:w-1/2 lg:w-1/4 px-2 py-2'>
              <div className="flex gap-4 items-center h-full rounded-md p-6 text-md border border-neutral-300">
                  <div className="border border-orange-500 rounded-full p-3 bg-orange-400/50">
                      {/* <Truck className="w-5 h-5 text-orange-500" /> */}
                  </div>
                  <div>
                      <h3 className="text-sm font-bold text-muted-foreground">Total Revenue</h3>
                      {/* <p className="text-3xl">{loadedQuery.data?.count}</p> */}
                  </div>
              </div>
          </div>
          <div className='w-full sm:w-1/2 lg:w-1/4 px-2 py-2'>
              <div className="flex gap-4 items-center h-full rounded-md p-6 text-md border border-neutral-300">
                  <div className="border border-blue-700 rounded-full p-3 bg-blue-400/50">
                      {/* <PackageOpen className="w-5 h-5 text-blue-700" /> */}
                  </div>
                  <div>
                      <h3 className="text-sm font-bold text-muted-foreground">Total Vendors</h3>
                      {/* <p className="text-3xl">{enrouteQuery.data?.count}</p> */}
                  </div>
              </div>
          </div>
          <div className='w-full sm:w-1/2 lg:w-1/4 px-2 py-2'>
              <div className="flex gap-4 items-center h-full rounded-md p-6 text-md border border-neutral-300">
                  <div className="border border-emerald-700 rounded-full p-3 bg-emerald-400/50">
                      {/* <PackageCheck className="w-5 h-5 text-emerald-700" /> */}
                  </div>
                  <div>
                      <h3 className="text-sm font-bold text-muted-foreground">Total Products</h3>
                      {/* <p className="text-3xl">{arrivedQuery.data?.count}</p> */}
                  </div>
              </div>
          </div>
          <div className='w-full sm:w-1/2 lg:w-1/4 px-2 py-2'>
              <div className="flex gap-4 items-center h-full rounded-md p-6 text-md border border-neutral-300">
                  <div className="border border-emerald-700 rounded-full p-3 bg-emerald-400/50">
                      {/* <PackageCheck className="w-5 h-5 text-emerald-700" /> */}
                  </div>
                  <div>
                      <h3 className="text-sm font-bold text-muted-foreground">Total Orders</h3>
                      {/* <p className="text-3xl">{arrivedQuery.data?.count}</p> */}
                  </div>
              </div>
          </div>
        </div>
        {/* <div className="mt-6 flex items-center justify-between">
          <h3 className="font-bold">Packages</h3>
          <div>
            <CreatePackage trigger={
              <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add Package</span>
              </button>}
            />
          </div>
        </div> */}
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
          <AllVendors status={status} filtering={filtering}/>
        </div>
      </div>
    </>
  )
}

export default Vendors
