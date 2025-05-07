import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

type OrdersFilters = {
    status?: "PENDING" | "SHIPPING" | "SHIPPED" | "DELIVERED" | "FAILED" | "CANCELLED" | "RETURNED",
}

export function useOrdersFilters (){
    const [searchParams, setSearchParams] = useSearchParams()

    const status = searchParams.get("status") as OrdersFilters['status']

    const setFilters = useCallback((filters:OrdersFilters)=> {
        setSearchParams((params)=>{
            if(filters.status !== undefined){
                params.set("status", filters.status)
            }else{
                params.delete("status")
            }

            return params
        })
    }, [])

    return {status, setFilters}
}