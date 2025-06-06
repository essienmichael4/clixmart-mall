import AllCommissions from "@/components/AllCommissions"
import AddCommission from "./AddCommission"

const CategoryCommissions = () => {
  return (
    <div>
        <div className="flex items-center justify-between">
            <h4 className="font-semibold">Categories commissions</h4>
            <AddCommission trigger={
                <button className="text-xs text-white py-2 px-4 rounded-md bg-cyan-700">Add Commission</button>
                } />
        </div>
        <div className="my-4">
            <AllCommissions />
        </div>
    </div>
  )
}

export default CategoryCommissions
