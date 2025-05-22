import { axios_instance } from "@/api/axios";
import { Product } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import ProductStatic from "../Cards/ProductStatic"
import { Skeleton } from "../ui/skeleton";
import { Link } from "react-router-dom";

interface SectionProps {
    category: string,
    title: string
}

const StaticProducts = ({category, title}:SectionProps) => {
    const {data:products, isLoading} = useQuery<Product[]>({
        queryKey: ["products", category],
        queryFn: async() => await axios_instance.get(`/products/categories/${category}/home?take=24`).then(res => {
            console.log(res.data);
            
            return res.data.data
        })
    })

    const content = isLoading ? (
            <Skeleton>
                <div className="h-32 w-full">
    
                </div>
            </Skeleton>
        ) : (
            <div className="py-2">
                <div className="border p-4 rounded-lg">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm lg:text-xl font-semibold">{title}</h3>
                        <Link to="" className="text-xs text-white py-2 text-nowrap px-3 bg-cyan-700 hover:bg-cyan-500 rounded-full">See more</Link>
                    </div>

                    <div className='w-full flex flex-wrap'>
                        {products?.map(product=>{
                            return <ProductStatic product={product} />
                        })}
                    </div>
                </div>
            </div>
    )

    return content
}

export default StaticProducts
