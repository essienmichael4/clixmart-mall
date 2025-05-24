import { FormatCurrency } from "@/lib/helper"
import { Order } from "@/lib/types"
import { Star } from "lucide-react"
import { Link } from "react-router-dom"

interface OrderProps {
    order: Order
}

const OrderCard = ({order }: OrderProps,  ) => {
    const orderBody = (<>
      <div className="flex items-center justify-between">
        <span className={`inline-block ${order.status === "PENDING" && 'bg-gray-100'} ${order.status === "DELIVERED" && 'bg-emerald-100 text-emerald-700'} ${order.status === "SHIPPING" && 'bg-yellow-100 text-yellow-700'} ${order.status === "SHIPPED" && 'bg-orange-100 text-orange-700'} ${order.status === "FAILED" && 'bg-red-100 text-red-700'} ${order.status === "CANCELLED" && 'bg-rose-100 text-rose-700'} ${order.status === "RETURNED" && 'bg-purple-100 text-purple-700'} py-2 px-4 rounded-full text-[.7rem]`}>{"PENDING"}</span>
        <div className="text-xs flex items-center gap-2"><Star className="w-4 h-4"/> Rate and review order</div>
      </div>

      <div>
        <div className="mt-2 flex items-center justify-between flex-wrap">
          <p className="text-xs">{new Date(order.createdAt).toDateString()} | Order No.: {order.orderId} </p>
          <p className="text-xs text-nowrap">Total:  <span className="text-xl">{FormatCurrency(2000)}</span></p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
            <div className="flex items-center justify-center">
            {order.orderItems.map(item=>{
                if(item.product.imageUrl){
                    return (
                        <div key={item.id} className="rounded-full overflow-hidden aspect-square w-16 mr-4">
                            <img src={item.product.imageUrl} className="w-full h-full" alt="" />
                        </div>
                    )
                }
            })}
            </div>
          <p className="max-w-[320px] line-clamp-2 overflow-hidden text-ellipsis">{order.orderItems.map(item=> item.name).toString()}</p>
        </div>
        <Link to={`/orders/${order.orderId}`} className="py-2 px-4 rounded-lg border text-xs text-gray-500 hover:bg-black/50 hover:text-gray-100 text-nowrap">Order details</Link>
      </div>
    </>)

    const content = <div 
      className='border rounded-lg p-4'
    >{orderBody}</div>

    return content
}

export default OrderCard
