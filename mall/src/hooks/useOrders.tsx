import { Order } from "@/lib/types"
import { useOrdersFilters } from "./useOrdersFilters"
import useAxiosToken from "./useAxiosToken"
import useAuth from "./useAuth"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect, useRef, useState } from "react"

interface OrdersResponse {
    data: Order[],
    meta: {
        page: number,
        take: number,
        itemCount: number,
        pageCount: number,
        hasPreviousPage: boolean,
        hasNextPage: boolean
    }
}

interface OrdersParams {
    take?:number,
}

const useOrders = ({take=20}: OrdersParams) => {
    const [page, setPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(true)
    const [results, setResults] = useState<Order[]>([])
    const {status} = useOrdersFilters()
    const axios_instance_token = useAxiosToken()
    const {auth} = useAuth()

    const fetchOrders = async():Promise<OrdersResponse> => {
        const search: [string, string][] = []
        if(status && status !== undefined && status !== null) search.push(["status", status])
        const params = new URLSearchParams(search).toString()
        
        const ordersQuery = await axios_instance_token.get(`/orders/users/${auth?.id}?page=${page}&take=${take}&${params}`).then(res => {
            return res.data
        })

        return ordersQuery
    }

    const {data: ordersData, isLoading} = useQuery<OrdersResponse>({
        queryKey: ["orders", status],
        queryFn: async() => fetchOrders()
    })
    
    useEffect(() => {
        setPage(1)
        setResults([]) // Clear old results
    }, [status])

    useEffect(() => {
        if (ordersData?.data) {
            setResults(prev => [...prev, ...ordersData.data])
            setHasNextPage(ordersData.meta.hasNextPage)
        }
    }, [ordersData])

    const observer = useRef<IntersectionObserver | null>(null)
    const lastItemRef = useCallback((node: HTMLDivElement) => {
        if (isLoading) return
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
            setPage(prev => prev + 1)
        }
        })

        if (node) observer.current.observe(node)
    }, [isLoading, hasNextPage])

    return {orders: results, hasNextPage: ordersData?.meta.hasNextPage, isLoading, lastItemRef,}
}

export default useOrders
