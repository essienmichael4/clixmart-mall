import { useNavigate, useParams } from "react-router-dom"
// import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { ArrowLeft, FileBox } from "lucide-react"
import { FormatCurrency } from "@/lib/helper"
import { Separator } from "@/components/ui/separator"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useQuery } from "@tanstack/react-query"
import useAuth from "@/hooks/useAuth"
import { Order } from "@/lib/types"

const OrderDetails = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const {auth} = useAuth()
  const axios_instance_token = useAxiosToken()

  const {data:orderQuery} = useQuery<Order>({
      queryKey: ["orders", auth?.id, id ],
      queryFn: async() => await axios_instance_token.get(`/orders/users/${auth?.id}/${id}`).then(res => {
          return res.data
      })
  })

  return (
    <div>
      <div className="flex flex-col flex-wrap mt-4 gap-2">
        <button onClick={()=>navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4 text-gray-400" />
           <span className="text-xs text-gray-400">Back to orders</span>
        </button>
      </div>

      <div className="mt-4 flex flex-col ">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-xl">Your Order</h2>
          <span className="text-xs text-gray-600 bg-gray-200 py-1 px-2 rounded-md">{id}</span>
        </div>
        {orderQuery && <span className="text-xs">{orderQuery?.orderItems.length +1} items</span>}
      </div>

      <div className="rounded-lg border border-gray-300 mt-5 mb-8">
        <div className="flex p-4 justify-between flex-wrap gap-2 sm:gap-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gray-100">
              <FileBox className=" text-gray-500 w-10 h-10"/>
            </div>
            <div>
                {orderQuery && <p className="text-xl">{FormatCurrency(orderQuery?.total)}</p>}
                <span className="text-xs text-gray-500">GHS</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div>
              {orderQuery && <p className="text-sm font-semibold text-nowrap">{new Date(orderQuery?.createdAt).toDateString()}</p>}
              <span className="text-xs">Order placed</span>
            </div>
            <div>
              {orderQuery && <p className="text-sm font-semibold text-nowrap">{orderQuery.user?.name}</p>}
              <span className="text-xs">Shipping to</span>
            </div>
            <div>
              {orderQuery && <p className="text-xs text-nowrap py-1 px-2 bg-gray-200 rounded-full font-semibold">{orderQuery.status}</p>}
              <span className="text-xs">Status</span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="p-4 space-y-4">
          {orderQuery?.orderItems.map(item=>{
            return (
            <div className="p-4 border flex flex-wrap justify-between border-gray-300 rounded-md">
              <div className="flex gap-5">
                <div className="aspect-square overflow-hidden w-28 rounded-lg">
                  <img src={item.product.imageUrl} alt="" />
                </div>
                <div className="max-w-[500px]">
                  <h3 className="text-lg font-semibold line-clamp-2 text-ellipsis">{item.name}</h3>
                  <span className="text-xs line-clamp-2 text-ellipsis">Item eligible for return up to 12 days from purchase</span>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <p className="text-lg">{FormatCurrency(item.price)}</p>
                <span className="text-xs py-1 px-3 bg-gray-100 rounded-full">{item.status}</span>
              </div>
            </div>)
          })}
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
