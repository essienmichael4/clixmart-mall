import RevenueHistoryPeriodSelector from "@/components/HistoryChart/RevenueHistoryPeriodSelector"
import { Skeleton } from "@/components/ui/skeleton"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useQuery } from "@tanstack/react-query"

import { useState } from "react"

const TransactionsStatistics = () => {
    const axios_instance_token = useAxiosToken()
    const [timeframe, setTimeFrame] = useState<"MONTH" | "YEAR">("MONTH")
    const [period, setPeriod] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    })

    const {data:totalCommissions} = useQuery<any>({
        queryKey: ["settings", "revenue"],
        queryFn: async() => await axios_instance_token.get(`/settings/commissions}`).then(res => {
            return res.data
        })
    })

    const {data:transactionStats, isLoading} = useQuery<any>({
        queryKey: ["summary", "transactions", "revenue", "history", timeframe, period],
        queryFn: async() => await axios_instance_token.get(`/stats/revenue-history?timeframe=${timeframe}&month=${period.month}&year=${period.year}`).then(res => {
            return res.data
        })
    })

    const content = isLoading ? <Skeleton>
            <div className="sm:h-72 md:h-80 lg:h-96 w-full">

            </div>
        </Skeleton> : <div>
            <div className='flex items-center justify-between gap-8'>
                <h3 className='font-bold text-xl'>History</h3>

                <RevenueHistoryPeriodSelector 
                    timeframe={timeframe}
                    period={period}
                    setPeriod={setPeriod}
                    setTimeFrame={setTimeFrame}
                />
            </div>
            <div className="w-full flex flex-wrap mt-2">
                <div className='w-full sm:w-1/2 lg:w-1/5 px-2 py-2'>
                    <div className="flex gap-4 items-center h-full rounded-md p-3 text-md border border-neutral-300">
                        {/* <div className="border border-orange-500 rounded-full p-3 bg-orange-400/50">
                            <Truck className="w-5 h-5 text-orange-500" />
                        </div> */}
                        <div>
                            <h3 className="text-xs font-bold text-muted-foreground">Total Commission Revenue</h3>
                            <p className="text-xl">{totalCommissions?.commissionRevenue || 0}</p>
                        </div>
                    </div>
                </div>
                <div className='w-full sm:w-1/2 lg:w-1/5 px-2 py-2'>
                    <div className="flex gap-4 items-center h-full rounded-md p-3 text-md border border-neutral-300">
                        {/* <div className="border border-orange-500 rounded-full p-3 bg-orange-400/50">
                            <Truck className="w-5 h-5 text-orange-500" />
                        </div> */}
                        <div>
                            <h3 className="text-xs font-bold text-muted-foreground">Agg. Commissions Revenue</h3>
                            <p className="text-xl">{transactionStats.commissionRevenue}</p>
                        </div>
                    </div>
                </div>
                <div className='w-full sm:w-1/2 lg:w-1/5 px-2 py-2'>
                    <div className="flex gap-4 items-center h-full rounded-md p-3 text-md border border-neutral-300">
                        {/* <div className="border border-orange-500 rounded-full p-3 bg-orange-400/50">
                            <Truck className="w-5 h-5 text-orange-500" />
                        </div> */}
                        <div>
                            <h3 className="text-xs font-bold text-muted-foreground">Agg. Vendor Earnings</h3>
                            <p className="text-xl">{transactionStats.vendorEarnings}</p>
                        </div>
                    </div>
                </div>
                <div className='w-full sm:w-1/2 lg:w-1/5 px-2 py-2'>
                    <div className="flex gap-4 items-center h-full rounded-md p-3 text-md border border-neutral-300">
                        {/* <div className="border border-orange-500 rounded-full p-3 bg-orange-400/50">
                            <Truck className="w-5 h-5 text-orange-500" />
                        </div> */}
                        <div>
                            <h3 className="text-xs font-bold text-muted-foreground">Agg. Sold Revenue</h3>
                            <p className="text-xl">{transactionStats.soldRevenue}</p>
                        </div>
                    </div>
                </div>
                <div className='w-full sm:w-1/2 lg:w-1/5 px-2 py-2'>
                    <div className="flex gap-4 items-center h-full rounded-md p-3 text-md border border-neutral-300">
                        <div>
                            <h3 className="text-xs font-bold text-muted-foreground">Agg. Tax Revenue</h3>
                            <p className="text-xl">{transactionStats.taxRevenue}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    return (
        content
    )
}

export default TransactionsStatistics
