// import useCart from "@/hooks/useCart"
import { FormatCurrency } from "@/lib/helper"
import { Product } from "@/lib/types"
// import { ShoppingCart } from "lucide-react"
import React from "react"
import { Link } from "react-router-dom"

interface ProductProps {
    product: Product
}

const ProductStatic = React.forwardRef(({product }: ProductProps,  ) => {
    
    const productBody = (
        <>
            <Link to={`../products/${product.productId}`} className='border p-2 block overflow-hidden rounded-md'>
                <div className='relative'>
                    <div className='aspect-square relative rounded-md overflow-hidden border'>
                        <img src={product.imageUrl} alt="" />
                    </div>
                    {/* {!contains && <button onClick={(e)=> {
                        e?.stopPropagation()
                        e?.preventDefault()
                        increaseCartQuanity(product!.productId)
                    }} className='absolute -bottom-4 right-3 md:right-4 rounded-full bg-blue-800 p-2 border-2 border-white hover:bg-blue-400'><ShoppingCart className='w-3 h-3 sm:w-4 sm:h-4 text-white'/></button>} */}
                </div>
                <div className='mt-2 sm:mt-4 space-y-1 sm:space-y-1'>
                    <p className='text-[.6rem] sm:text-xs text-gray-400 uppercase'>{product.brand?.name}</p>
                    <h5 className='text-sm text-ellipsis text-nowrap overflow-hidden capitalize'>{product.name}</h5>
                    <p className='text-sm font-semibold'>{FormatCurrency(product.price)}</p>
                </div>
            </Link> 
        </>
    )

    const content = <div className='p-1 sm:p-2 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6'
        >{productBody}</div>

    return content
})

export default ProductStatic
