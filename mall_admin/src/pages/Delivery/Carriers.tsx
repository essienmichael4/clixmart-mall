import { Separator } from "@/components/ui/separator"
import { Plus, Search } from "lucide-react"
import { useState } from "react"
import { useDebounce } from "use-debounce"
import CarriersTable from "./_components/CarriersTable"
import AddCarrier from "./_components/AddCarrier"

const Carriers = () => {
  const [search, setSearch] = useState("")
  const [debouncedValue] = useDebounce(search, 500)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  return (
    <div className="container w-full mx-auto mt-2 px-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Carriers</h1>
          <p className="text-xs text-gray-400">This is the Carries management page for all inter-city and inter region transports.</p>
        </div>
        <AddCarrier trigger={
          <button className="text-xs flex gap-1 items-center text-white py-2 px-4 bg-cyan-900 rounded-md"><Plus className="w-3 h-3 text-white" /> New Carrier</button>
        } />
      </div>
      <Separator className="mb-2" />
      <div className="flex items-center justify-between">
        {/* Content for Hubs filtering and listing will go here */}
        <p className="text-xs text-gray-500">Carriers filtering and listing functionality coming soon.</p>
        <div className="ml-auto flex items-center gap-2 border border-gray-300 rounded-md px-2 py-2 focus-within:border-gray-500">
          <Search  className="w-3 h-3 text-gray-400"/>
          <input type="text" placeholder="Search carrier..." className="outline-none text-xs"
            onChange={e => {
                setSearch(e.target.value)
                setPage(1)
              }
            }
          />
        </div>
      </div>
      <Separator className="my-2" />
      <CarriersTable limit={limit} search={debouncedValue} page={page} setLimit={setLimit} setPage={setPage} />
    </div>
  )
}

export default Carriers
