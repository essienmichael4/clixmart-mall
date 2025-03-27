import useCart from "@/hooks/useCart"
import { FormatCurrency } from "@/lib/helper"
import { Product } from "@/lib/types"
import { ShoppingCart } from "lucide-react"
import React from "react"
import { Link } from "react-router-dom"

interface ProductProps {
    product: Product
    ref: React.LegacyRef<HTMLDivElement> | undefined
}

const ProductCard = React.forwardRef(({product, ref }: ProductProps,  ) => {
    const {increaseCartQuanity, cartItems} = useCart()
    const contains = cartItems.some(item=> item.id ===product.productId)
    
    const productBody = (
        <>
            <Link to={`products/${product.productId}`} className='border p-2 rounded-md'>
                <div className='relative'>
                    <div className='aspect-square relative rounded-md overflow-hidden border'>
                    </div>
                    {!contains && <button onClick={(e)=> {
                        e?.stopPropagation()
                        e?.preventDefault()
                        increaseCartQuanity(product!.productId)
                    }} className='absolute -bottom-5 right-4 rounded-full bg-blue-800 p-2 border-2 border-white hover:bg-blue-400'><ShoppingCart className='w-4 h-4 sm:w-5 sm:h-5 text-white'/></button>}
                </div>
                <div className='mt-4 space-y-1 sm:space-y-1'>
                    <p className='text-xs text-gray-400 uppercase'>{product.brand?.name}</p>
                    <h5 className='text-sm text-ellipsis text-nowrap overflow-hidden capitalize'>{product.name}</h5>
                    <p className='font-semibold'>{FormatCurrency(product.price)}</p>
                </div>
            </Link>
        </>
    )

    const content = ref ? 
        <div ref={ref} className='p-1 sm:p-2 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 overflow-hidden'>{productBody}</div>
        :
        <div className='p-1 sm:p-2 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 overflow-hidden'>{productBody}</div>

    return content
})

export default ProductCard
