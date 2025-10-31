import { PlusCircle } from "lucide-react"
import AddPaymentDialog from "./_components/PaymentDialog"
import VendorPayouts from "./_components/VendorPayouts"

const Payouts = () => {
  return (
    <div className="container px-4 mx-auto">
      <div className="mt-6 mb-4 flex items-center gap-2 justify-between">
        <h3 className="font-bold text-lg text-nowrap">Payouts</h3>
        <AddPaymentDialog trigger={<button className="text-xs text-white py-2 px-4 rounded flex items-center bg-emerald-500 gap-2"><PlusCircle className="w-4 h-4 text-white"/>Make Payment</button>} />
      </div>
      <VendorPayouts />
    </div>
  )
}

export default Payouts
