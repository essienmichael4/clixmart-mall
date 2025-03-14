import Header from "@/components/Header"
import ProductCard from "@/components/Cards/ProductCard"
import useProductsSearch from "@/hooks/useProductSearch"
import { useCallback, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"

const Search = () => {
    const [query] = useSearchParams()
    const [page, setPage] = useState(1)
    console.log(query.get('q'))
    const {products, isLoading, hasNextPage} = useProductsSearch({page, q:query.get('q') || ""})
    
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
            <div className='container space-y-2 px-4 mx-auto mt-8'>
                <h3>Top Products</h3>
                {isLoading && "loading..."}
                <div className='flex flex-wrap'>
                    {products.map((product, i)=>{
                        console.log(product);
                        
                        if(products.length === i+1) return <ProductCard ref={lastProductRef} key={i} product={product} />
                       return <ProductCard key={i} product={product} />
                    }) }
                </div>
            </div>
        </>
    )
}

export default Search