import useAxiosToken from "@/hooks/useAxiosToken"
import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Order } from "@/lib/types"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Edit, Trash2 } from "lucide-react"
import { FormatCurrency } from "@/lib/helper"

const OrderDetails = () => {
    const {store, id} = useParams()
    const navigate = useNavigate()
    const axios_instance_token = useAxiosToken()

    const orderQuery = useQuery<Order>({
        queryKey: ["orders", id],
        queryFn: async() => await axios_instance_token.get(`/products/store/${store}/${id}`).then(res => {
            return res.data
        })
    })
    
    return (
        <>
            <div className="container mx-auto">
                <div  className="mt-4 mx-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={()=> navigate(-1)} className="flex items-center justify-center w-8 h-8 border rounded-full text-gray-400 hover:text-gray-600 hover:border-gray-600">
                            &larr;
                        </button>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                <BreadcrumbLink href="/" className="text-xs">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="text-xs"/>
                                <BreadcrumbItem>
                                <BreadcrumbLink href="../orders" className="text-xs">Orders</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="text-xs"/>
                                <BreadcrumbItem>
                                <BreadcrumbPage className="text-xs">{id}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to={"./edit"} className="flex items-center gap-1 text-xs hover:text-emerald-500"><Edit  className="w-4 h-4"/> Edit</Link>
                        <button className="flex items-center gap-1 text-xs hover:text-rose-500"><Trash2  className="w-4 h-4"/> Delete</button>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                    <div>
                        <h3>#{orderQuery.data?.orderId}</h3>
                        <p className="text-xs bg-gray-400">{new Date(orderQuery.data?.createdAt as string).toDateString()} from Draft Orders</p>
                    </div>
                </div>
                <div className="p-4">
                    <h4>Order Items</h4>
                    <div>
                        {orderQuery.data?.orderItems.map(orderItem => {
                            return (
                                <div className="p-2">
                                    <div className="flex">
                                        <div>
                                            <div className="w-36 aspect-square"></div>
                                            <div>
                                                <h5>{orderItem.name}</h5>
                                                <p>{orderItem.product.productId}</p>
                                                <p>{orderItem.product.category.name}/{orderItem.product.subCategory.name}</p>
                                                <p>{orderItem.product.brand?.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div>
                                            <p>Owner name</p>
                                            <h5>{orderItem.product.user?.name}</h5>
                                        </div>
                                        <div>
                                            <p>Owner email</p>
                                            <h5>{orderItem.product.user?.email}</h5>
                                        </div>
                                        <div>
                                            <p>Owner contact</p>
                                            <h5>{orderItem.product.user?.phone}</h5>
                                        </div>
                                        <div>
                                            <p>Store name</p>
                                            <h5>{orderItem.product.store?.name}</h5>
                                        </div>
                                        <div>
                                            <p>Store id</p>
                                            <h5>{orderItem.product.store?.id}</h5>
                                        </div>
                                        <div>
                                            <p>Store contact</p>
                                            <h5>{orderItem.product.store?.storeAddress?.phone}</h5>
                                        </div>
                                        <div>
                                            <p>Store address</p>
                                            <h5>{orderItem.product.store?.storeAddress?.addressLine}</h5>
                                            <p>{orderItem.product.store?.storeAddress?.city} . {orderItem.product.store?.storeAddress?.state} . {orderItem.product.store?.storeAddress?.country}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        
                    </div>
                </div>
                <div className="p-4">
                    <h4>Order Summary</h4>
                    <div>
                        <div className="flex items-center justify-between">
                            <p>Sub Total</p>
                            <div className="flex items-center justify-between">
                                <p>{orderQuery.data?.orderItems.reduce((total, item) =>{
                                        return total += item.quantity
                                    }, 0)} items
                                </p>
                                <p>{FormatCurrency(orderQuery.data!.orderItems.reduce((total, item) =>{
                                        return total += item.quantity * item.price
                                    }, 0))}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <p>Discount</p>
                            <div className="flex items-center justify-between">
                                <p> items</p>
                                <p>{FormatCurrency(orderQuery.data!.discount)}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <p>Total</p>
                            <div className="flex items-center justify-between">
                                <p>{FormatCurrency(orderQuery.data!.total)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <h4>Customer Details</h4>
                    <div>
                        <div>
                            <p>Name</p>
                            <h5>{orderQuery.data?.user?.name}</h5>
                        </div>
                        <div>
                            <p>Email</p>
                            <h5>{orderQuery.data?.user?.email}</h5>
                        </div>
                        <div>
                            <p>Phone</p>
                            <h5>{orderQuery.data?.user?.phone}</h5>
                        </div>
                        <div>
                            <p>Order Date</p>
                            <h5>{orderQuery.data?.createdAt}</h5>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderDetails
