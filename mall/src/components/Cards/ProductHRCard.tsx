import { FormatCurrency } from "@/lib/helper"
import { Product } from "@/lib/types"
import React from "react"
interface ProductProps {
    product: Product
}

const ProductHRCard = React.forwardRef(({product}: ProductProps,  ) => {
    const productBody = (
        <>
            <div className='border p-2 rounded-md flex gap-3'>
                <div className='relative'>
                    <div className='aspect-square w-28 md:w-40 relative rounded-md overflow-hidden border'>
                    </div>
                </div>
                <div className='mt-1 md:mt-4 space-y-1 sm:space-y-2 flex flex-col relative'>
                    <h5 className='w-40 text-sm md:text-xl font-semibold line-clamp-1 md:line-clamp-2 text-ellipsis overflow-hidden'>{product.name}</h5>
                    <p className='text-xs md:text-sm uppercase text-gray-400'>{product.brand?.name}</p>
                    <p className='font-semibold text-xs md:text-sm'>{FormatCurrency(product.price)}</p>
                    <button className="border border-gray-700 absolute bottom-1 py-2 rounded-full font-semibold w-full text-xs uppercase text-gray-700">Shop now</button>
                </div>
            </div>
        </>
    )

    const content = <div className='min-w-[310px] md:min-w-[393px] overflow-hidden mx-1'>{productBody}</div>

    return content
})

export default ProductHRCard
