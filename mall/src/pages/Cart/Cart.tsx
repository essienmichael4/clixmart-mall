import CartItem from "@/components/CartItem"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,} from "@/components/ui/breadcrumb"
// import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import useAxiosToken from "@/hooks/useAxiosToken"
import useCart from "@/hooks/useCart"
import { FormatCurrency } from "@/lib/helper"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useState } from "react"
// import { Product } from "@/lib/types"
// import { useState } from "react"
import { toast } from "sonner"

const Cart = () => {
    const {cartItems, getTotalCost, emptyCart} = useCart()
    const [isPending, setIsPending] = useState(false)
    const axios_instance_token = useAxiosToken()

    const handleCreateOrder = async ( )=>{
        try{
            setIsPending(true)
            toast.loading("Ordering...", {
                id: "order"
            })
            const response = await axios_instance_token.post("/orders", {
                items: cartItems
            })
            console.log(response.data);
            
            setIsPending(false)
            emptyCart()
            toast.success("Order placed successfully...", {
                id: "order"
            })
        }catch(err:any){
            setIsPending(false)
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "order"
                })
            }
        }
        
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
                    <div className="w-full flex flex-col md:w-1/4 p-2 h-60 border rounded-lg space-y-2">
                        <h4 className="text-sm font-bold">Order Summary</h4>
                        <div className="flex items-center justify-between ">
                            <h4 className="text-xs">Subtotal</h4>
                            <p className="text-xs">
                            {FormatCurrency(
                                getTotalCost()
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
                            )}
                            </p>
                        </div>
                        <div className="flex bg-gray-100 my-3 rounded-full border focus-within:border-gray-500">
                            <input  className="border-none rounded-l-full flex-1 py-2 px-3 outline-none bg-transparent text-xs shadow-none" placeholder="Apply promo code" />
                            <button className="text-xs bg-cyan-700 text-white px-4 rounded-full">Apply</button>
                        </div>
                        <button onClick={handleCreateOrder} className="w-full text-xs py-2 bg-blue-700 text-white rounded-full">
                            {!isPending && "Checkout"}
                            {isPending && <Loader2 className='animate-spin' /> }
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Cart
