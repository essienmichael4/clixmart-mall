import { Product } from "@/lib/types"
import ProductHRCard from "../Cards/ProductHRCard"
import { Button } from "../ui/button"
import { ArrowBigLeft, ArrowBigRight } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { axios_instance } from "@/api/axios"
import { Skeleton } from "../ui/skeleton"

interface SectionProps {
  category: string
  title: string
}

const HorizontalCategoryCarousel = ({ category, title }: SectionProps) => {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products", { category }],
    queryFn: async () =>
      await axios_instance
        .get(`/products/categories/${category}/home?take=10`)
        .then((res) => res.data.data),
  })

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

  if (isLoading) {
    return (
      <Skeleton>
        <div className="h-32 w-full"></div>
      </Skeleton>
    )
  }

  return (
    <div className="py-2">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="relative">
        {/* Scroll Container */}
        <div
          className="flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-none transition-all"
          ref={scrollElement}
        >
          {products?.map((product, i) => (
            <ProductHRCard key={i} product={product} />
          ))}
        </div>

        {/* Left Arrow */}
        <Button
          variant="ghost"
          onClick={() => slide("left")}
          className={`hidden md:flex z-50 absolute left-0 top-[4.5rem] -translate-x-[50%] 
            transition-opacity duration-300 ${
              canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          aria-label="previous"
        >
          <ArrowBigLeft />
        </Button>

        {/* Right Arrow */}
        <Button
          variant="ghost"
          onClick={() => slide("right")}
          className={`hidden md:flex z-50 absolute right-0 top-[4.5rem] translate-x-[50%] 
            transition-opacity duration-300 ${
              canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          aria-label="next"
        >
          <ArrowBigRight />
        </Button>
      </div>
    </div>
  )
}

export default HorizontalCategoryCarousel
