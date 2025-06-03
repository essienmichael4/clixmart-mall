import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import useAxiosToken from "@/hooks/useAxiosToken"
import { FormatCurrency } from "@/lib/helper"
import { Order } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import OrderItemStatus from "./OrderItemStatus"

const OrderDetails = () => {
    const {store, id} = useParams()
    const navigate = useNavigate()
    const axios_instance_token = useAxiosToken()

    const orderQuery = useQuery<Order>({
        queryKey: ["orders", {store, id}],
        queryFn: async() => await axios_instance_token.get(`/orders/stores/${store}/${id}`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })
    
    return (
        <div className="container px-4 mx-auto">
            <div  className="mt-4 flex relative items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={()=> navigate(-1)} className="flex items-center justify-center w-6 h-6 border rounded-full text-gray-400 hover:text-gray-600 hover:border-gray-600">
                            &larr;
                        </button>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                <BreadcrumbLink href="../orders" className="text-xs">Orders</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="text-xs"/>
                                <BreadcrumbItem>
                                <BreadcrumbPage className="text-xs">{orderQuery.data?.orderId}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
            <div className="mt-6 flex items-center gap-4">
                <div>
                    <h3>#{orderQuery.data?.orderId}</h3>
                    <p className="text-xs text-gray-400">{new Date(orderQuery.data?.createdAt as string).toDateString()} from Draft Orders</p>
                </div>
                <span className={`inline-block ${orderQuery.data?.status === "PENDING" && 'bg-gray-100'} ${orderQuery.data?.status === "DELIVERED" && 'bg-emerald-100 text-emerald-700'} ${orderQuery.data?.status === "SHIPPING" && 'bg-yellow-100 text-yellow-700'} ${orderQuery.data?.status === "SHIPPED" && 'bg-orange-100 text-orange-700'} ${orderQuery.data?.status === "FAILED" && 'bg-red-100 text-red-700'} ${orderQuery.data?.status === "CANCELLED" && 'bg-rose-100 text-rose-700'} ${orderQuery.data?.status === "RETURNED" && 'bg-purple-100 text-purple-700'} py-2 px-4 rounded-full text-[.7rem]`}>{orderQuery.data?.status}</span>
            </div>
            <div className="mt-4 border p-4 rounded-lg">
                <h4 className="text-xl mb-3 font-bold">Customer Details</h4>
                <div className="mt-4 flex flex-wrap gap-8">
                    <div>
                        <h5 className="text-xs text-gray-300 mb-2">Name</h5>
                        <p className="capitalize">{orderQuery.data?.user?.name}</p>
                    </div>
                    <div>
                        <h5 className="text-xs text-gray-300 mb-2">Email</h5>
                        <p>{orderQuery.data?.user?.email}</p>
                    </div>
                    <div>
                        <h5 className="text-xs text-gray-300 mb-2">Phone</h5>
                        <p>{orderQuery.data?.user?.phone ? orderQuery.data?.user?.phone : "-"}</p>
                    </div>
                    <div>
                        <h5 className="text-xs text-gray-300 mb-2">Order Date</h5>
                        <p>{orderQuery.data?.createdAt}</p>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <div className="border p-4 rounded-lg">
                <h4 className="text-xl mb-3 font-bold">Order Items</h4>
                    {orderQuery.data?.orderItems.map((orderItem, idx) => {
                        return (
                            <div key={idx} className="p-4 border mb-4 rounded-lg">
                                <div >
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="aspect-square w-full md:w-60 border rounded-xl overflow-hidden">
                                            <img src={orderItem?.product?.imageUrl} alt="" />
                                        </div>
                                        <div className="space-y-2 w-full relative">
                                            <div className="flex flex-1 items-center justify-between">
                                                <span className={`inline-block ${orderItem.status === "PENDING" && 'bg-gray-100'} ${orderItem.status === "DELIVERED" && 'bg-emerald-100 text-emerald-700'} ${orderItem.status === "SHIPPING" && 'bg-yellow-100 text-yellow-700'} ${orderItem.status === "SHIPPED" && 'bg-orange-100 text-orange-700'} ${orderItem.status === "FAILED" && 'bg-red-100 text-red-700'} ${orderItem.status === "CANCELLED" && 'bg-rose-100 text-rose-700'} ${orderItem.status === "RETURNED" && 'bg-purple-100 text-purple-700'} py-2 px-4 rounded-full text-[.7rem]`}>{orderItem.status}</span>
                                                <div className="flex gap-3">
                                                    <span className="py-2 px-4 rounded-lg text-xs border">{orderItem.quantity} x {FormatCurrency(orderItem.price)}</span>
                                                    <span className="py-2 px-4 rounded-lg text-xs border">{FormatCurrency(orderItem.subTotal)}</span>
                                                </div>
                                            </div>
                                            <h5 className="text-2xl mt-2 capitalize">{orderItem.name}</h5>
                                            <p className="text-sm text-muted-foreground">{orderItem.product.productId}</p>
                                            <p className="capitalize text-xs text-muted-foreground text-cyan-700">{orderItem.product?.category?.name}/{orderItem.product?.subCategory?.name}</p>
                                            <p className="uppercase text-xs text-muted-foreground">{orderItem.product?.brand?.name}</p>
                                            {orderItem.status && <OrderItemStatus store={store as string} id={orderQuery.data.orderId as string} itemId={orderItem.orderItemId as string} status={orderItem.status} />}
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="mt-4 flex flex-wrap gap-8">
                                    <div>
                                        <h5 className="text-xs text-gray-300">Owner name</h5>
                                        <p className="capitalize">{orderItem.product.store?.user?.name}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-xs text-gray-300">Owner email</h5>
                                        <p>{orderItem.product.store?.user?.email}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-xs text-gray-300">Owner contact</h5>
                                        <p>{orderItem.product.store?.user?.phone ? orderItem.product.store?.user?.phone : "-"}</p>
                                    </div>
                                </div>
                                <div className="mt-8 flex gap-8 flex-wrap">
                                    <div>
                                        <h5  className="text-xs text-gray-300">Store name</h5>
                                        <p className="capitalize">{orderItem.product.store?.name}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-xs text-gray-300">Store id</h5>
                                        <p>{orderItem.product.store?.id}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-xs text-gray-300">Store contact</h5>
                                        <p>{orderItem.product.store?.storeAddress?.phone}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-xs text-gray-300">Store address</h5>
                                        <p>{orderItem.product.store?.storeAddress?.addressLine}</p>
                                        <p>{orderItem.product.store?.storeAddress?.city} , {orderItem.product.store?.storeAddress?.state} , {orderItem.product.store?.storeAddress?.country}</p>
                                    </div>
                                </div> */}
                            </div>
                        )
                    })}
                    
                </div>
            </div>
            <div className="p-4 border rounded-lg my-8">
                <h4 className="text-xl mb-3 font-bold">Order Summary</h4>
                <span className={`inline-block ${orderQuery.data?.isPaid === "PENDING" && 'bg-gray-100'} ${orderQuery.data?.isPaid === "DELIVERED" && 'bg-emerald-100 text-emerald-700'} ${orderQuery.data?.isPaid === "PAID" && 'bg-yellow-100 text-yellow-700'} ${orderQuery.data?.isPaid === "UNPAID" && 'bg-orange-100 text-orange-700'}  ${orderQuery.data?.isPaid === "CANCELLED" && 'bg-rose-100 text-rose-700'} mb-4 py-2 px-4 rounded-full text-[.7rem]`}>{orderQuery.data?.isPaid}</span>
                <div>
                    <div className="flex items-center justify-between">
                        <p>Sub Total</p>
                        <div className="flex items-center justify-between w-[30%]">
                            <p>{orderQuery.data?.orderItems.reduce((total, item) =>{
                                    return total += item.quantity
                                }, 0)} items
                            </p>
                            <p>{orderQuery.data && FormatCurrency(orderQuery.data!.orderItems.reduce((total, item) =>{
                                    return total += item.quantity * item.price
                                }, 0))}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <p>Discount</p>
                        <div className="flex items-center justify-between">
                            {/* <p> items</p> */}
                            <p>{orderQuery.data && FormatCurrency(Number(orderQuery.data!.discount))}</p>
                        </div>
                    </div>
                    <Separator className="my-4"/>
                    <div className="flex items-center justify-between">
                        <p className="font-bold text-md">Total</p>
                        <div className="flex items-center justify-between">
                            <p className="text-md mb-3 font-bold">{orderQuery.data && FormatCurrency(Number(orderQuery.data!.total))}</p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default OrderDetails
