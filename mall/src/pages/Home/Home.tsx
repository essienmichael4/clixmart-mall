import Billboard from '@/components/Billboard'
import Categories from '@/components/Categories'
import Header from '@/components/Header'
import ProductCard from '@/components/Cards/ProductCard'
import useProducts from '@/hooks/useProducts'
// import { Product } from '@/lib/types'
import { useCallback, useRef, useState } from 'react'
import ProductHRCard from '@/components/Cards/ProductHRCard'
import SectionCarousel from '@/components/Carousel/SectionCarousel'
import HorizontalCarousel from '@/components/Carousel/HorizontalCarousel'

const Home = () => {
    const [page, setPage] = useState(1)
    const {products, isLoading, hasNextPage} = useProducts({page})
    
    const intObserver = useRef<IntersectionObserver>()
    const lastProductRef = useCallback((node:HTMLDivElement)=>{
        if(isLoading) return

        if(intObserver.current) intObserver.current.disconnect()
        intObserver.current = new IntersectionObserver(products => {
            if(products[0].isIntersecting && hasNextPage)
                setPage(prev => prev + 1)
        })

        if(node) intObserver.current.observe(node)
    }, [isLoading, hasNextPage])

    return (
        <>
            <Header />
            <div className='container flex gap-8 px-4 mx-auto mt-8'>
                <Categories />
                <Billboard />
            </div>
            <div className='container space-y-2 px-4 mx-auto mt-8'>
                <h3>Top Products</h3>
                {isLoading && "loading..."}
                {/* <div className='flex flex-wrap'> */}
                {/* <SectionCarousel products={products} /> */}
                {/* </div> */}

                <HorizontalCarousel products={products}/>
            </div>
        </>
    )
}

export default Home
