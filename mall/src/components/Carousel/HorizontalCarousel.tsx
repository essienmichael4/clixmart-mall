import { Product } from "@/lib/types"
import ProductHRCard from "../Cards/ProductHRCard"
import { Button } from "../ui/button"
import { ArrowBigLeft, ArrowBigRight } from "lucide-react"
import { useRef, useState } from "react"

interface SectionProps {
    products: Product[]
}

const HorizontalCarousel = ({products}:SectionProps) => {
    const [scroll, setScroll] = useState(0)
    const scrollElement = useRef<HTMLDivElement | null>(null)
    const slideRight = () => {
        scrollElement.current!.scrollLeft += 400
    }
    const slideLeft = () => {
        scrollElement.current!.scrollLeft -= 400
    }

    return (
        <div className="relative" >
            <div className="flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none transition-all" ref={scrollElement}>
                {products.map((product, i)=> <ProductHRCard key={i} product={product} />)}
            </div>
            <Button variant={"ghost"} onClick={slideLeft} className="hidden md:block z-50 absolute left-0 top-[4.5rem] -translate-x-[50%] " aria-label="next">
                <ArrowBigLeft />
            </Button>
            <Button variant={"ghost"} onClick={slideRight} className="hidden md:block z-50 absolute right-0 top-[4.5rem] translate-x-[50%]" aria-label="next">
                <ArrowBigRight />
            </Button>
        </div>
    )
}

export default HorizontalCarousel
