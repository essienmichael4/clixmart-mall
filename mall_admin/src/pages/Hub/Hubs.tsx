import { Separator } from "@/components/ui/separator"
import { Plus, Search } from "lucide-react"
import HubsTable from "./_components/HubsTable"
import { useState } from "react"
import { useDebounce } from "use-debounce"
import AddHub from "./_components/AddHub"

const Hubs = () => {
  const [search, setSearch] = useState("")
  const [debouncedValue] = useDebounce(search, 500)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  return (
    <div className="container w-full mx-auto mt-2 px-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Hubs</h1>
          <p className="text-xs text-gray-400">This is the Hubs management page.</p>
        </div>
        <AddHub trigger={
          <button className="text-xs flex gap-1 items-center text-white py-2 px-4 bg-cyan-900 rounded-md"><Plus className="w-3 h-3 text-white" /> New Hub</button>
        } />
      </div>
      <Separator className="mb-2" />
      <div className="flex items-center justify-between">
        {/* Content for Hubs filtering and listing will go here */}
        <p className="text-xs text-gray-500">Hub filtering and listing functionality coming soon.</p>
        <div className="ml-auto flex items-center gap-2 border border-gray-300 rounded-md px-2 py-2 focus-within:border-gray-500">
          <Search  className="w-3 h-3 text-gray-400"/>
          <input type="text" placeholder="Search hubs..." className="outline-none text-xs"
            onChange={e => {
                setSearch(e.target.value)
                setPage(1)
              }
            }
          />
        </div>
      </div>
      <Separator className="my-2" />
      <HubsTable limit={limit} search={debouncedValue} page={page} setLimit={setLimit} setPage={setPage} />
    </div>
  )
}

export default Hubs
