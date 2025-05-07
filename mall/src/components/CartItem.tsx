import useAxiosToken from '@/hooks/useAxiosToken'
import useCart from '@/hooks/useCart'
import { Product } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { Separator } from './ui/separator'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { FormatCurrency } from '@/lib/helper'

interface CartItemsProps {
    id: string,
    quantity: number
}

const CartItem = ({id, quantity}: CartItemsProps) => {
    const axios_instance_token = useAxiosToken()
    const {removeFromCart, increaseCartQuanity, decreaseCartQuantity} = useCart()

    const product = useQuery<Product>({
        queryKey: ["cart",id],
        queryFn: async() => await axios_instance_token.get(`/products/${id}`).then(res => res.data)
    })

    if(!product) return null
    return (
        <div className='p-2 md:p-4 flex gap-4 border mb-4 rounded-lg'>
            <div className='w-24 aspect-square rounded-lg overflow-hidden'>
                <img src={product.data?.imageUrl} alt="" />
            </div>
            <div className='flex-1'>
                <div className='flex justify-between py-1 md:py-2'>
                    <div>
                        <h3 className='font-semibold text-xs md:text-sm capitalize text-nowrap text-ellipsis w-[8rem] md:w-[15rem] overflow-hidden'>{product.data?.name}</h3>
                        <p className='uppercase text-xs text-gray-500'>{product.data?.brand?.name}</p>
                    </div>
                    <div>
                        <div className='flex flex-nowrap items-start gap-1 md:gap-2 text-muted-foreground'>
                            <p className='text-xs'>Price:</p>
                            <p className='text-xs'>{FormatCurrency(Number(product.data?.price))}</p>
                        </div>
                        <div className='flex mt-1 flex-nowrap items-start gap-1 md:gap-2 font-semibold'>
                            <p className='text-xs md:text-sm'>Total:</p>
                            <p className='text-xs md:text-sm'>{FormatCurrency(Number(product.data?.price) * quantity)}</p>
                        </div>
                    </div>
                </div>
                <Separator />
                <div className='flex justify-between mt-2'>
                    <div></div>
                    <div className='flex items-center gap-4'>
                        <p className='text-xs text-gray-500'>Quantity:</p>
                        <button onClick={()=>decreaseCartQuantity(id)} className='p-1 border rounded-md text-gray-600 hover:text-blue-600 hover:border-blue-400'><Minus className='w-2 h-2 md:w-3 md:h-3'/></button>
                        <p>{quantity}</p>
                        <button onClick={()=> increaseCartQuanity(id)} className='p-1 border rounded-md text-gray-600 hover:text-blue-600 hover:border-blue-400'><Plus className='w-2 h-2 md:w-3 md:h-3'/></button>
                        <button onClick={()=>removeFromCart(id)} className='p-1 border rounded-md text-gray-600 bg-gray-200 hover:text-rose-600'><Trash2 className='w-2 h-2 md:w-3 md:h-3 '/></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItem