import { Product } from "@/lib/types"
import { Button } from "../ui/button"
import { ArrowBigLeft, ArrowBigRight } from "lucide-react"
import { useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { axios_instance } from "@/api/axios"
import ProductDealsCard from "../Cards/ProductDeals"
import { Skeleton } from "../ui/skeleton"

interface SectionProps {
    category: string,
    title: string
}

const HorizontalDealsCarousel = ({category, title}:SectionProps) => {

    const {data:products, isLoading} = useQuery<Product[]>({
        queryKey: ["products", category],
        queryFn: async() => await axios_instance.get(`/products/categories/${category}/home?take=10`).then(res => {
            console.log(res.data);
            
            return res.data.data
        })
    })

    const scrollElement = useRef<HTMLDivElement | null>(null)
    const slideRight = () => {
        scrollElement.current!.scrollLeft += 400
    }
    const slideLeft = () => {
        scrollElement.current!.scrollLeft -= 400
    }

    const content = isLoading ? (
        <Skeleton>
            <div className="h-32 w-full">

            </div>
        </Skeleton>
    ) : (
        <div className="py-2">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>

            <div className="relative" >
                <div className="flex items-center gap-2 md:gap-2 overflow-scroll scrollbar-none transition-all" ref={scrollElement}>
                    { products?.map((product, i)=> <ProductDealsCard key={i} product={product} />)}
                </div>
                <Button variant={"ghost"} onClick={slideLeft} className="hidden bg-slate-100 md:block z-50 absolute left-0 top-[7.5rem] -translate-x-[50%] " aria-label="next">
                    <ArrowBigLeft />
                </Button>
                <Button variant={"ghost"} onClick={slideRight} className="hidden bg-slate-100 md:block z-50 absolute right-0 top-[7.5rem] translate-x-[50%]" aria-label="next">
                    <ArrowBigRight />
                </Button>
            </div>
        </div>
    )

    return content
}

export default HorizontalDealsCarousel
