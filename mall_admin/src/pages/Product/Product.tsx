import { axios_instance } from "@/api/axios"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,} from "@/components/ui/breadcrumb"
import { FormatCurrency } from "@/lib/helper"
import { Product } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { Star } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import ProductApproval from "./ProductApproval"
import DescriptionParser from "@/components/DescriptionParser"
import { useState } from "react"

const ProductDetails = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [activeImage, setActiveImage] = useState("")

    const product = useQuery<Product>({
        queryKey: ["product", id],
        queryFn: async() => await axios_instance.get(`/products/${id}`).then(res => {
            console.log(res.data);
            
            res.data?.imageUrl ? 
                setActiveImage(res.data.imageUrl) : 
                res.data?.productImages ? setActiveImage(res.data.productImages[0].url) : setActiveImage("")
            return res.data
        })
    })

    const handleImageClick = (image: string) => {
        setActiveImage(image)
    }

    const tags = product.data?.tags.length
    console.log(product.data);
    
    
    return (
        <>
            <div className="container mx-auto mb-8">
                <div  className="mt-4 mx-4 flex relative items-center justify-between gap-4">
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
                                <BreadcrumbLink href="../products" className="text-xs">Products</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="text-xs"/>
                                <BreadcrumbItem>
                                <BreadcrumbPage className="text-xs">{product.data?.productId}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <ProductApproval approval={product.data?.productReview?.status as string} id={product.data?.productId as string} />
                </div>
                <div className="flex justify-between flex-col md:flex-row flex-wrap mb-4 lg:mb-0 px-4 mt-4">
                    <div className="min-w-[320px] md:max-w-[320px] w-full md:w-1/3 flex flex-wrap gap-4 p-4">
                        <div className="w-full aspect-square border rounded-xl overflow-hidden">
                            <img src={activeImage} alt="" />
                        </div>
                        <div className="w-full flex items-center justify-between">
                            {product.data?.imageUrl && <button onClick={() => handleImageClick(product.data.imageUrl as string)} className="flex items-center justify-center w-[18%] aspect-square rounded-lg border overflow-hidden">
                                    <img src={product.data.imageUrl} alt="" />
                            </button>
                            }
                            {
                                product.data?.productImages.map((image, idx) =>{
                                    return <button key={idx} onClick={() => handleImageClick(image.imageUrl as string)} className="flex items-center justify-center w-[18%] aspect-square rounded-lg border overflow-hidden">
                                        <img src={image.url} alt="" />
                                    </button>
                                })
                            }
                        </div>
                    </div>
                    <div className="min-w-[320px] w-full md:w-2/3 flex flex-col flex-wrap justify-self-end gap-2 px-4">
                        <p className="text-xs text-blue-700 font-semibold">{product.data?.category?.name} / {product.data?.subCategory?.name}</p>
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
                                <p className="text-sm text-gray-400">1 reviews</p>
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
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Description</p>
                            <DescriptionParser description={product.data?.description as string || ""} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetails
