import { useState } from "react"
import OrderItemTransactions from "./_components/OrderItemTransactions"
import StoreTransactions from "./_components/StoreTransactions"
import TransactionsStatistics from "./_components/TransactionsStatistics"

const Transactions = () => {
  const [active, setActive] = useState("Items")

  const handleActiveChange = (status: string) => {
    setActive(status)
  }

  return (
    <div>
      <div>
        <TransactionsStatistics />
      </div>
      <div className="my-3">
        <div className="flex gap-2">
          <button onClick={()=>handleActiveChange("Items")} className={`${active === "Items" && "bg-gray-500"} text-xs py-1 px-2 rounded-md border`}>Items</button>
          <button onClick={()=>handleActiveChange("Stores")} className={`${active === "Stores" && "bg-gray-500"} text-xs py-1 px-2 rounded-md border`}>Stores</button>
        </div>
      </div>
      <div>
        {
          active === "Items" ? <><OrderItemTransactions /></> : <><StoreTransactions /></>
        }
      </div>
    </div>
  )
}

export default Transactions
