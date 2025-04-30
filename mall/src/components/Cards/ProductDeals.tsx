// import useCart from "@/hooks/useCart"
import { FormatCurrency } from "@/lib/helper"
import { Product } from "@/lib/types"
import React from "react"
import { Link } from "react-router-dom"
interface ProductProps {
    product: Product
}

const ProductDealsCard = React.forwardRef(({product}: ProductProps,  ) => {
    // const {increaseCartQuanity, cartItems} = useCart()
    // const contains = cartItems.some(item=> item.id ===product.productId)

    const productBody = (
        <>
            <div className='p-2 rounded-md gap-3'>
                <div className='relative'>
                    <div className='aspect-square w-48 relative rounded-md overflow-hidden'>
                        <img src={product.imageUrl} alt="" />
                    </div>
                </div>
                <div className='mt-1 md:mt-4 space-y-1 flex flex-col relative'>
                    <h5 className='text-sm capitalize font-semibold line-clamp-1 text-ellipsis overflow-hidden'>{product.name}</h5>
                    <p className='text-xs uppercase text-gray-400'>{product.brand?.name}</p>
                    <p className='font-semibold text-xs md:text-sm'>{FormatCurrency(product.price)}</p>
                </div>
            </div>
        </>
    )

    const content = <Link to={`products/${product.productId}`} className='border rounded-sm w-52 min-w-52 overflow-hidden'>{productBody}</Link>

    return content
})

export default ProductDealsCard
