import Billboard from '@/components/Billboard'
import Categories from '@/components/Categories'
import Header from '@/components/Header'
import useProducts from '@/hooks/useProducts'
import { useState } from 'react'
import HorizontalCarousel from '@/components/Carousel/HorizontalCarousel'

const Home = () => {
    const [page, ] = useState(1)
    const {products, isLoading} = useProducts({page})
    
    // const intObserver = useRef<IntersectionObserver>()
    // const lastProductRef = useCallback((node:HTMLDivElement)=>{
    //     if(isLoading) return

    //     if(intObserver.current) intObserver.current.disconnect()
    //     intObserver.current = new IntersectionObserver(products => {
    //         if(products[0].isIntersecting && hasNextPage)
    //             setPage(prev => prev + 1)
    //     })

    //     if(node) intObserver.current.observe(node)
    // }, [isLoading, hasNextPage])

    return (
        <>
            <Header />
            <div className='container flex gap-8 px-4 mx-auto mt-8'>
                <Categories />
                <Billboard />
                {/* <div className='w-40'>
                    info
                </div> */}
            </div>
            <div className='container space-y-2 px-4 mx-auto mt-8'>
                <h3>Top Products</h3>
                {isLoading && "loading..."}

                <HorizontalCarousel products={products}/>
            </div>
        </>
    )
}

export default Home
