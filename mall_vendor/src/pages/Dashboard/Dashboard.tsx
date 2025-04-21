import HistoryChart from "@/components/HistoryChart/HistoryChart"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useQuery } from "@tanstack/react-query"
import { PackageCheck, PackageOpen, Truck } from "lucide-react"
import { useParams } from "react-router-dom"

interface countRequest {
    revenue: string,
    products: number,
    orders: number
}

const Dashboard = () => {
    const axios_instance_token = useAxiosToken()
    const {store} = useParams()

    const statsQuery = useQuery<countRequest>({
        queryKey: ["stats", "vendor"],
        queryFn: async() => await axios_instance_token.get(`/stats/vendor/${store}`).then(res => res.data)
    })

    return (
        <>
            <div className="container w-full mx-auto mt-4 px-4">
                <div className="w-full flex flex-wrap">
                    <div className='w-full sm:w-1/2 lg:w-1/3 px-2 py-2'>
                        <div className="flex gap-4 items-center h-full rounded-md p-6 text-md border border-neutral-300">
                            <div className="border border-orange-500 rounded-full p-3 bg-orange-400/50">
                                <Truck className="w-10 h-10 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-muted-foreground">Total Revenue</h3>
                                <p className="text-3xl">{statsQuery.data?.revenue}</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-full sm:w-1/2 lg:w-1/3 px-2 py-2'>
                        <div className="flex gap-4 items-center h-full rounded-md p-6 text-md border border-neutral-300">
                            <div className="border border-blue-700 rounded-full p-3 bg-blue-400/50">
                                <PackageOpen className="w-10 h-10 text-blue-700" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-muted-foreground">Total Produts</h3>
                                <p className="text-3xl">{statsQuery.data?.products}</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-full sm:w-1/2 lg:w-1/3 px-2 py-2'>
                        <div className="flex gap-4 items-center h-full rounded-md p-6 text-md border border-neutral-300">
                            <div className="border border-emerald-700 rounded-full p-3 bg-emerald-400/50">
                                <PackageCheck className="w-10 h-10 text-emerald-700" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-muted-foreground">Total Orders</h3>
                                <p className="text-3xl">{statsQuery.data?.orders}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='p-4 bg-white/15 mt-4 rounded-xl backdrop-blur-sm'>
                    <HistoryChart />
                </div>
                <div>
                </div>
            </div>
            
        </>
    )
}

export default Dashboard
