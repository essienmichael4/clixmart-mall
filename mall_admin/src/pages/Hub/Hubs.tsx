import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import HubsTable from "./_components/HubsTable"
import { useState } from "react"
import { useDebounce } from "use-debounce"

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
        <button className="text-xs flex gap-1 items-center text-white py-2 px-4 bg-cyan-900 rounded-md"><Plus className="w-3 h-3 text-white" /> New Hub</button>
      </div>
      <Separator className="mb-2" />
      <div>
        {/* Content for Hubs filtering and listing will go here */}
        <p className="text-xs text-gray-500">Hub filtering and listing functionality coming soon.</p>
      </div>
      <Separator className="my-2" />
      <HubsTable limit={limit} search={debouncedValue} page={page} setLimit={setLimit} setPage={setPage} />
    </div>
  )
}

export default Hubs
