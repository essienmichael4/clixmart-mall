import { useQuery } from "@tanstack/react-query";
import { axios_instance } from "@/api/axios";
import { CategoryProductsSearchParams, Product } from "@/lib/types";
import { useState } from "react";

interface ProductsResponse {
    data: Product[],
    meta: {
        page: number,
        take: number,
        itemCount: number,
        pageCount: number,
        hasPreviousPage: boolean,
        hasNextPage: boolean
    }
}

const useProductsSearch = ({page = 1, category, subCategories, take=50, brand}:CategoryProductsSearchParams) => {
    const [results, setResults] = useState<Product[]>([])
    const [hasNextPage, setHasNextPage] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [prevBrand, setPrevBrand] = useState("")
    const [prevCategory, setPrevCategory] = useState("")
    const [prevSubCategory, setPrevSubCategory] = useState<string[]>([])
    
// @ts-ignore
    const productsQuery = useQuery<ProductsResponse>({
        queryKey: ["products", page, category, subCategories],
        queryFn: async() => await axios_instance.get(`/products/categories/${category}?page=${page}&take=${take}&subCategories=${subCategories?.toString()}&brand=${brand || ""}`).then(res => {
            setIsLoading(true)            
            return res.data
        }).then((res)=>{
            setIsLoading(false)
            if(prevCategory == category && subCategories == prevSubCategory && prevBrand == brand){
                setResults(prev => [...prev, ...res.data])
            }else{
                setResults(res.data)
                setPrevCategory(category || "")
                setPrevSubCategory(subCategories || [])
                setPrevBrand(brand || "")
            }
            setHasNextPage(res.data.meta.hasNextPage)
            return res.data
        })
    })


    return {products: results, hasNextPage, isLoading}
}

export default useProductsSearch
