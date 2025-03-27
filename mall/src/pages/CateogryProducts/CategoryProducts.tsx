import Header from "@/components/Header"
import ProductCard from "@/components/Cards/ProductCard"
import useCategoriesProducts from "@/hooks/useCategoriesProducts"
import { useCallback, useRef, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import CategoriesCheck from "@/components/CategoriesCheck"

const CategoryProducts = () => {
    const {category} = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const urlParams = new URLSearchParams(location.search)
    const subCategoriesParams = urlParams.getAll("sub-categories")
    const [subCategories, setSubCategories] = useState(subCategoriesParams)
    const [page, setPage] = useState(1)
    const {products, isLoading, hasNextPage} = useCategoriesProducts({page, category:category, subCategories: subCategories})
    
    const handleSubCategoriesChange = (subCategoryId: string) => {
        if(subCategories.includes(subCategoryId)){
            const sub = subCategories.filter(el=> el !== subCategoryId)
            setSubCategories(sub)
        }else{
            setSubCategories([...subCategories, subCategoryId])
        }
        const urlFormat = subCategories.map((sub, idx)=>{
            if((subCategories.length - 1) == idx){
                return `sub-categories=${sub}`
            }

            return `sub-categories=${sub}&`
        })
        navigate(`../categories/${category}?${urlFormat.join("")}`)
    }

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
                <div className="flex">
                    <CategoriesCheck subCategoriesChange={handleSubCategoriesChange} subCategories={subCategories} activeCategory={category as string} />
                    {isLoading && "loading..."}
                    <div className='flex flex-wrap'>
                        {products?.map((product, i)=>{
                            console.log(product);
                            
                            if(products.length === i+1) return <ProductCard ref={lastProductRef} key={i} product={product} />
                        return <ProductCard key={i} product={product} />
                        }) }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CategoryProducts
