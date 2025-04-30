import Billboard from '@/components/Billboard'
import Categories from '@/components/Categories'
import Header from '@/components/Header'
// import useProducts from '@/hooks/useProducts'
// import { useState } from 'react'
// import HorizontalCarousel from '@/components/Carousel/HorizontalCarousel'
import HorizontalCategoryCarousel from '@/components/Carousel/HorizontalCategoryCarousel'
import HorizontalDealsCarousel from '@/components/Carousel/HorizontalDealsCarousel'

const Home = () => {
    // const [page, ] = useState(1)
    // const {products, isLoading} = useProducts({page})
    // const categories = ["Electronics", "Appliances"]
    
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
            <div className='container space-y-2 px-4 mx-auto my-8'>
                {/* <HorizontalCarousel products={products}/> */}
                
                <HorizontalCategoryCarousel title="Top Appliance" category='Appliances' />
                <HorizontalDealsCarousel title="Hot Electronics" category='Electronics' />
                <HorizontalCategoryCarousel title="Home and Office" category='Home-&-Office' />
                <HorizontalCategoryCarousel title="Fashion and Beauty" category='fashion-&-beauty' />
                <HorizontalCategoryCarousel title="Hot Phone Deals" category='phones-&-tablets' />
            </div>
        </>
    )
}

export default Home
