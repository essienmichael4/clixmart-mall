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

const useProductsSearch = ({page = 1, category, subCategory, take=50, brand}:CategoryProductsSearchParams) => {
    const [results, setResults] = useState<Product[]>([])
    const [hasNextPage, setHasNextPage] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [prevBrand, setPrevBrand] = useState("")
    const [prevCategory, setPrevCategory] = useState("")
    const [prevSubCategory, setPrevSubCategory] = useState<string[]>([])
    

    const productsQuery = useQuery<ProductsResponse>({
        queryKey: ["products", page, category, subCategory],
        queryFn: async() => await axios_instance.get(`/products/categories?page=${page}&take=${take}&category=${category || ""}&subCategory=${subCategory?.toString() || ""}&brand=${brand}`).then(res => {
            setIsLoading(true)
            console.log(res.data);
            
            return res.data
        }).then((res)=>{
            setIsLoading(false)
            if(prevCategory == category && subCategory == prevSubCategory && prevBrand == brand){
                setResults(prev => [...prev, ...res.data])
            }else{
                setResults(res.data)
                setPrevCategory(category || "")
                setPrevSubCategory(subCategory || [])
                setPrevBrand(brand || "")
            }
            setHasNextPage(res.data.meta.hasNextPage)
            return res.data
        })
    })


    return {products: results, hasNextPage, isLoading}
}

export default useProductsSearch
