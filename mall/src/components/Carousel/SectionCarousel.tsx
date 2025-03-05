import { Product } from "@/lib/types"
import AliceCarousel from "react-alice-carousel"
import { Button } from "../ui/button";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useState } from "react";
import ProductHRCard from "../Cards/ProductHRCard";

interface SectionProps {
    products: Product[]
}

const SectionCarousel = ({products}:SectionProps) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const responsive = {
        0: { items: 1 },
        720: { items: 2 },
        1024: { items: 3 },
    };

    const slidePrevious = () => setActiveIndex(activeIndex-1)
    const slideNext = () => setActiveIndex(activeIndex+1)
    const syncActiveIndex = (item:any) => setActiveIndex(item)

    const items = products.map((item:Product)=> <ProductHRCard product={item} />)
    return (
        <div className="relative">
            <div className="py-2 relative">

                <AliceCarousel
                    mouseTracking
                    items={items}
                    disableButtonsControls
                    disableDotsControls
                    // autoPlay
                    // autoPlayInterval={10000}
                    infinite
                    responsive={responsive}
                    onSlideChange={syncActiveIndex}
                    activeIndex={activeIndex}
                    // controlsStrategy="alternate"
                    />
                { activeIndex !== items.length-3 && <Button variant={"ghost"} onClick={slideNext} className="z-50 absolute right-0 top-[6.5rem] translate-x-[50%]" aria-label="next">
                    <ArrowBigRight />
                </Button>}
                { activeIndex !== 0 && <Button variant={"ghost"} onClick={slidePrevious} className="z-50 absolute left-0 top-[6.5rem] -translate-x-[50%] " aria-label="next">
                    <ArrowBigLeft />
                </Button>}
               
            </div>
        </div>
    )
}

export default SectionCarousel
