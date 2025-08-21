import { Product } from "@/lib/types"
import ProductHRCard from "../Cards/ProductHRCard"
import { Button } from "../ui/button"
import { ArrowBigLeft, ArrowBigRight } from "lucide-react"
import { useRef, useState, useEffect } from "react"

interface SectionProps {
  products: Product[]
}

const HorizontalCarousel = ({ products }: SectionProps) => {
  const scrollElement = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollPosition = () => {
    const el = scrollElement.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth)
  }

  useEffect(() => {
    checkScrollPosition()
    const el = scrollElement.current
    if (!el) return
    el.addEventListener("scroll", checkScrollPosition)
    window.addEventListener("resize", checkScrollPosition)
    return () => {
      el.removeEventListener("scroll", checkScrollPosition)
      window.removeEventListener("resize", checkScrollPosition)
    }
  }, [products])

  const slide = (direction: "left" | "right") => {
    const el = scrollElement.current
    if (!el) return
    const distance = el.offsetWidth * 0.8 // 80% of visible width
    el.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative">
      {/* Scroll Container */}
      <div
        className="flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-none transition-all"
        ref={scrollElement}
      >
        {products.map((product, i) => (
          <ProductHRCard key={i} product={product} />
        ))}
      </div>

      {/* Left Arrow */}
      <Button
        variant="ghost"
        onClick={() => slide("left")}
        className={`hidden md:flex z-50 absolute left-0 top-[4.5rem] -translate-x-[50%] 
          transition-opacity duration-300 ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-label="previous"
      >
        <ArrowBigLeft />
      </Button>

      {/* Right Arrow */}
      <Button
        variant="ghost"
        onClick={() => slide("right")}
        className={`hidden md:flex z-50 absolute right-0 top-[4.5rem] translate-x-[50%] 
          transition-opacity duration-300 ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-label="next"
      >
        <ArrowBigRight />
      </Button>
    </div>
  )
}

export default HorizontalCarousel
