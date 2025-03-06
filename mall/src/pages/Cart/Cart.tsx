import CartItem from "@/components/CartItem"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import useAxiosToken from "@/hooks/useAxiosToken"
import useCart from "@/hooks/useCart"
import { FormatCurrency } from "@/lib/helper"
import { Product } from "@/lib/types"
import { useState } from "react"
import { toast } from "sonner"

const Cart = () => {
    const {cartItems, getTotalCost} = useCart()
    const axios_instance_token = useAxiosToken()
    // const [products, setProducts] = useState<Product[]>([])

    // const prods = cartItems?.map(async(item)=>{
    //     const product:Product = await axios_instance_token.get(`/products/${item.id}`).then(res => res.data)
    //     // console.log(product.id);
    //     setProducts([...products, product])
    // })    

    const handleCreateOrder = async ( )=>{
        toast.loading("Ordering...", {
            id: "login"
        })
        const response = await axios_instance_token.post("/orders", {
            items: cartItems
        })

        console.log(response.data);
        toast.loading("Done...", {
            id: "login"
        })
        
    }
    

    return (
        <div>
            <Breadcrumb className="mt-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-xs">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-xs"/>
                    <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs">Cart</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="space-y-4 mt-4">
                <h2 className="font-semibold text-xl">My Cart</h2>
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-3/4 px-2">
                    {cartItems.map((item)=> (
                        <CartItem key={item.id} {...item} />
                    ))}
                    </div>
                    <div className="w-full flex flex-col md:w-1/4 p-2 h-48 border rounded-lg space-y-2">
                        <h4 className="text-sm font-bold">Order Summary</h4>
                        <div className="flex items-center justify-between ">
                            <h4 className="text-xs">Subtotal</h4>
                            <p className="text-xs">
                            {FormatCurrency(
                                getTotalCost()
                                // cartItems.reduce((total, item)=>{
                                //     const product = products.find((product)=> product.id === item.id)
                                //     return total + (product?.price || 0) * item.quantity
                                // }, 0)
                            )}
                            </p>
                        </div>
                        <div className="flex items-center justify-between ">
                            <h4 className="text-xs">Discount</h4>
                            <p className="text-xs">
                            {FormatCurrency(0)}
                            </p>
                        </div>
                        <div className="flex items-center justify-between ">
                            <h4 className="text-xs">Tax</h4>
                            <p className="text-xs">
                            {FormatCurrency(0)}
                            </p>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between ">
                            <h4 className="text-xs">Total</h4>
                            <p className="text-xs">
                            {FormatCurrency(
                                getTotalCost()
                                // cartItems.reduce((total, item)=>{
                                //     const product = products.find((product)=> product.id === item.id)
                                //     return total + (product?.price || 0) * item.quantity
                                // }, 0)
                            )}
                            </p>
                        </div>
                        <button onClick={handleCreateOrder} className="w-full text-xs py-2 bg-blue-700 text-white rounded-full">Checkout</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Cart
