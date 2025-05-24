import OrderCard from "@/components/Cards/OrderCard"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import useOrders from "@/hooks/useOrders"
import { useOrdersFilters } from "@/hooks/useOrdersFilters"

const Orders = () => {
  const {status, setFilters} = useOrdersFilters()
  const {orders, lastItemRef} = useOrders({take: 20})

  return (
    <div className="">
      <Breadcrumb className="mt-4">
        <BreadcrumbList>
            <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-xs">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-xs"/>
            <BreadcrumbItem>
            <BreadcrumbPage className="text-xs">My Orders</BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-4 flex items-center justify-between">
        <h2 className="font-semibold text-xl">My Orders</h2>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=> {setFilters({status: undefined})}} className={`${!status && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>All</button>
          <button  onClick={()=> { setFilters({ status: "PENDING"})}} className={`${status === "PENDING" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Pending</button>
          <button  onClick={()=> {setFilters({ status: "SHIPPING"})}} className={`${status === "SHIPPING" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Shipping</button>
          <button  onClick={()=> {setFilters({ status: "SHIPPED"})}} className={`${status === "SHIPPED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Shipped</button>
          <button onClick={()=> { setFilters({status: "DELIVERED"})}} className={`${status === "DELIVERED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Delivered</button>
          <button  onClick={()=> { setFilters({status: "CANCELLED"})}} className={`${status === "CANCELLED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Cancelled</button>
          <button  onClick={()=> { setFilters({status: "FAILED"})}} className={`${status === "FAILED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Failed</button>
          <button  onClick={()=> { setFilters({status: "RETURNED"})}} className={`${status === "RETURNED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Returned</button>
        </div>
      </div>
      <div className="mt-4 space-y-4">
      {orders.length > 0 ? <>
       {orders.map((order, idx)=> {
         const isLast = idx === orders.length - 1
         return (
           <div key={order.id} ref={isLast ? lastItemRef : null}>
              <OrderCard order={order} />
            </div>
          )
        })}
        </>  : 
        <>
          <div className="h-36 flex items-center justify-center">
            <p>No orders yet for this section</p>
          </div>
        </>}
      </div>
    </div>
  )
}

export default Orders
