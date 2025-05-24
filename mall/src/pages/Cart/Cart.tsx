import CartItem from "@/components/CartItem"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import useCart from "@/hooks/useCart"
import { FormatCurrency } from "@/lib/helper"
import { Link } from "react-router-dom"

const Cart = () => {
    const {cartItems, getTotalCost} = useCart()
    
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
                        <Link to={`../checkout`} className="w-full text-xs py-2 bg-cyan-700 flex items-center justify-center text-white rounded-full"> Proceed to checkout</Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Cart
