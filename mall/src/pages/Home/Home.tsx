import Billboard from '@/components/Billboard'
import Categories from '@/components/Categories'
import Header from '@/components/Header'
import ad from '@/assets/ad.jpg'
import profit from '@/assets/profit.jpg'
import call from '@/assets/call.jpg'
// import useProducts from '@/hooks/useProducts'
// import { useState } from 'react'
// import HorizontalCarousel from '@/components/Carousel/HorizontalCarousel'
import HorizontalCategoryCarousel from '@/components/Carousel/HorizontalCategoryCarousel'
import HorizontalDealsCarousel from '@/components/Carousel/HorizontalDealsCarousel'
import StaticCategories from '@/components/Static/StaticCategories'
import StaticProducts from '@/components/Static/StaticProducts'

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
            <div className='container flex gap-4 px-4 mx-auto mt-8'>
                <Categories />
                <Billboard />
                <div className='xl:w-64 md:w-56 hidden md:flex lg:hidden xl:flex flex-col justify-between '>
                    <div className='space-y-3'>
                        <a target='_blank' className='flex items-center gap-2' href='https://vendor.clixmartonline.com'>
                            <div className='w-12 h-12 overflow-hidden rounded-lg'>
                                <img src={profit} alt="" className='w-full h-full' />
                            </div>
                            <div className=' flex flex-col'>
                                <p className='text-sm'>Sell on Clixmart</p>
                                <span className='text-xs'>Make profit with us.</span>
                            </div>
                        </a>
                        <div className='flex items-center gap-2'>
                            <div className='w-12 h-12 overflow-hidden rounded-lg'>
                                <img src={call} alt="" className='w-full h-full' />
                            </div>
                            <div className=' flex flex-col'>
                                <p className='text-sm'>Call to Order</p>
                                <span className='text-sm'>+233 552 771 004</span>
                            </div>
                        </div>
                    </div>
                    <div className='aspect-square rounded-lg overflow-hidden'>
                        <img src={ad} alt="" />
                    </div>
                </div>
            </div>
            <div className='container space-y-2 px-4 mx-auto my-8'>
                {/* <HorizontalCarousel products={products}/> */}
                
                {/* <HorizontalCategoryCarousel title="Top Appliance" category='Appliances' /> */}
                <HorizontalDealsCarousel title="Hot Electronics" category='Electronics' />
                <StaticCategories />
                <HorizontalCategoryCarousel title="Home and Office" category='Home-&-Office' />
                <HorizontalCategoryCarousel title="Fashion and Beauty" category='fashion-&-beauty' />
                <StaticProducts title="Unbeatable Appliance's deals" category='Appliances' />
                <HorizontalCategoryCarousel title="Hot Phone Deals" category='phones-&-tablets' />
            </div>
        </>
    )
}

export default Home
