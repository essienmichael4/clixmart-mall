import { axios_instance } from "@/api/axios"
import Header from "@/components/Header"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,} from "@/components/ui/breadcrumb"
import useCart from "@/hooks/useCart"
// import { Button } from "@/components/ui/button"
import { FormatCurrency } from "@/lib/helper"
import { Product } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { Heart, Minus, Plus, Star } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

const ProductDetails = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const {increaseCartQuanity, decreaseCartQuantity, getItemQuantity} = useCart()

    const product = useQuery<Product>({
        queryKey: ["product", id],
        queryFn: async() => await axios_instance.get(`/products/${id}`).then(res => {
            return res.data
        })
    })

    // const itemQuantity = getItemQuantity(Number(product.data?.id))
    const tags = product.data?.tags.length
    
    return (
        <>
            <Header />
            <div className="container mx-auto">
                <div  className="mt-4 mx-4 flex items-center gap-4">
                    <button onClick={()=> navigate(-1)} className="flex items-center justify-center w-6 h-6 border rounded-full text-gray-400 hover:text-gray-600 hover:border-gray-600">
                        &larr;
                    </button>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                            <BreadcrumbLink href="/" className="text-xs">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-xs"/>
                            <BreadcrumbItem>
                            <BreadcrumbLink href="../products" className="text-xs">Products</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-xs"/>
                            <BreadcrumbItem>
                            <BreadcrumbPage className="text-xs">Cart</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex justify-between flex-wrap mb-4 lg:mb-0 px-4 mt-4">
                    <div className="min-w-[320px] w-full md:w-1/3 flex flex-wrap gap-4 p-4">
                        <div className="w-full aspect-square border rounded-xl"></div>
                        <div className="w-full flex items-center justify-between">
                            <button className="flex items-center justify-center w-[18%] aspect-square rounded-lg border"></button>
                            <button className="flex items-center justify-center w-[18%] aspect-square rounded-lg border"></button>
                            <button className="flex items-center justify-center w-[18%] aspect-square rounded-lg border"></button>
                            <button className="flex items-center justify-center w-[18%] aspect-square rounded-lg border"></button>
                            <button className="flex items-center justify-center w-[18%] aspect-square rounded-lg border"></button>
                        </div>
                    </div>
                    <div className="min-w-[320px] w-full md:w-2/3 flex flex-col flex-wrap justify-self-end gap-2 px-4">
                        <p className="text-xs text-blue-700 font-semibold">{product.data?.category.name} / {product.data?.subCategory.name}</p>
                        <h4 className="text-4xl font-semibold capitalize">{product.data?.name}</h4>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-gray-400"/>
                                    <Star className="w-4 h-4 text-gray-400"/>
                                    <Star className="w-4 h-4 text-gray-400"/>
                                    <Star className="w-4 h-4 text-gray-400"/>
                                    <Star className="w-4 h-4 text-gray-400"/>
                                </div>
                                <p className="text-sm text-gray-400">5 reviews</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-gray-400"/>
                                <p className="text-sm text-gray-400">Add to Wishlist</p>
                            </div>
                        </div>
                        <p className="text-xl font-semibold">{FormatCurrency(Number(product.data?.price))}</p>
                        <p className="text-xs text-muted-foreground uppercase">{product.data?.brand?.name}</p>
                        {Number(tags) > 0 && <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Tags</p>
                            <div className="flex flex-wrap items-center gap-2">
                                {product.data?.tags.map((tag, idx)=><span key={idx} className="text-xs py-1 px-4 border rounded-full text-gray-500">{tag.name}</span>)}
                            </div>
                        </div>}
                        <div>
                            {getItemQuantity(Number(product.data?.id)) === 0 && <button onClick={()=> increaseCartQuanity(Number(product.data?.id))} className="uppercase text-xs py-3 bg-blue-700 text-white rounded-md border px-12">Add to cart</button>}
                            {getItemQuantity(Number(product.data?.id)) > 0 && <div className=''>
                                <p className='text-xs font-semibold text-muted-foreground mb-1'>Qty:</p>
                                <div className="flex items-center gap-4">
                                    <button onClick={()=>decreaseCartQuantity(Number(product.data?.id))} className='p-1 md:p-2 border rounded-md text-gray-600 hover:text-blue-600 hover:border-blue-400'><Minus className='w-2 h-2 md:w-4 md:h-4'/></button>
                                    <p>{getItemQuantity(Number(product.data?.id))}</p>
                                    <button onClick={()=> increaseCartQuanity(Number(product.data?.id))} className='p-1 md:p-2 border rounded-md text-gray-600 hover:text-blue-600 hover:border-blue-400'><Plus className='w-2 h-2 md:w-4 md:h-4'/></button>
                                    {/* <button onClick={()=>removeFromCart(Number(product.data?.id))} className='p-1 border rounded-md text-gray-600 bg-gray-200 hover:text-rose-600'><Trash2 className='w-2 h-2 md:w-3 md:h-3 '/></button> */}
                                </div>
                            </div>}
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Description</p>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetails
