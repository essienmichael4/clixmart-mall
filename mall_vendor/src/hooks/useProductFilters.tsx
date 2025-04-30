import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

type ProductFilters = {
    status?: "DRAFT" | "PUBLISH" | "ARCHIVE",
    review?: "PENDING" | "APPROVED" | "REJECTED"
}

export function useProductFilters (){
    const [searchParams, setSearchParams] = useSearchParams()

    const status = searchParams.get("status") as ProductFilters['status']
    const review = searchParams.get("review") as ProductFilters['review']

    const setFilters = useCallback((filters:ProductFilters)=> {
        setSearchParams((params)=>{
            if(filters.status !== undefined){
                params.set("status", filters.status)
            }else{
                params.delete("status")
            }

            if(filters.review !== undefined){
                params.set("review", filters.review)
            }else{
                params.delete("review")
            }

            return params
        })
    }, [])

    return {status, review, setFilters}
}