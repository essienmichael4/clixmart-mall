import { useQuery } from "@tanstack/react-query";
import { axios_instance } from "@/api/axios";
import { Product, ProductSearchParams } from "@/lib/types";
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

const useProducts = ({q, page = 1, category, subCategory, take=50}:ProductSearchParams) => {
    const [results, setResults] = useState<Product[]>([])
    const [hasNextPage, setHasNextPage] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [query, setQuery] = useState("")
    const [prevCategory, setPrevCategory] = useState("")
    const [prevSubCategory, setPrevSubCategory] = useState("")

    // @ts-ignore
    const productsQuery = useQuery<ProductsResponse>({
        queryKey: ["products", q, page, category, subCategory],
        queryFn: async() => await axios_instance.get(`/products?q=${q || ""}&page=${page}&take=${take}&category=${category || ""}&subCategory=${subCategory || ""}`).then(res => {
            setIsLoading(true)
            console.log(res.data);
            
            return res.data
        }).then((res)=>{
            setIsLoading(false)
            if(query == q && prevCategory == category && subCategory == prevSubCategory){
                setResults(prev => [...prev, ...res.data])
            }else{
                setResults(res.data)
                setQuery(q || "")
                setPrevCategory(category || "")
                setPrevSubCategory(subCategory || "")
            }
            setHasNextPage(res.data.meta.hasNextPage)
            // console.log(results);
            
            return res.data
        })
    })


    return {products: results, hasNextPage, isLoading}
}

export default useProducts
