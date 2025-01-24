import ShippingReport from "@/components/ShippingReport"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useQuery } from "@tanstack/react-query"
import { PackageCheck, PackageOpen, Truck } from "lucide-react"

interface countRequest {
    count:number
}

const Dashboard = () => {
    const axios_instance_token = useAxiosToken()

    const loadedQuery = useQuery<countRequest>({
        queryKey: ["packages", "loaded"],
        queryFn: async() => await axios_instance_token.get(`/packages/dashboard/loaded`).then(res => res.data)
    })

    const enrouteQuery = useQuery<countRequest>({
        queryKey: ["packages", "enroute"],
        queryFn: async() => await axios_instance_token.get(`/packages/dashboard/enroute`).then(res => res.data)
    })

    const arrivedQuery = useQuery<countRequest>({
        queryKey: ["packages", "arrived"],
        queryFn: async() => await axios_instance_token.get(`/packages/dashboard/arrived`).then(res => res.data)
    })
    return (
        <>
            <div className="container w-full mx-auto mt-4 px-4">
                <div className="w-full flex flex-wrap">
                    <div className='w-full sm:w-1/2 lg:w-1/4 px-2 py-2'>
                        <div className="flex gap-4 items-center h-full rounded-md p-6 text-md border border-neutral-300">
                            <div className="border border-orange-500 rounded-full p-3 bg-orange-400/50">
                                <Truck className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-muted-foreground">Total Revenue</h3>
                                <p className="text-3xl">{loadedQuery.data?.count}</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-full sm:w-1/2 lg:w-1/4 px-2 py-2'>
                        <div className="flex gap-4 items-center h-full rounded-md p-6 text-md border border-neutral-300">
                            <div className="border border-blue-700 rounded-full p-3 bg-blue-400/50">
                                <PackageOpen className="w-5 h-5 text-blue-700" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-muted-foreground">Total Vendors</h3>
                                <p className="text-3xl">{enrouteQuery.data?.count}</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-full sm:w-1/2 lg:w-1/4 px-2 py-2'>
                        <div className="flex gap-4 items-center h-full rounded-md p-6 text-md border border-neutral-300">
                            <div className="border border-emerald-700 rounded-full p-3 bg-emerald-400/50">
                                <PackageCheck className="w-5 h-5 text-emerald-700" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-muted-foreground">Total Products</h3>
                                <p className="text-3xl">{arrivedQuery.data?.count}</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-full sm:w-1/2 lg:w-1/4 px-2 py-2'>
                        <div className="flex gap-4 items-center h-full rounded-md p-6 text-md border border-neutral-300">
                            <div className="border border-emerald-700 rounded-full p-3 bg-emerald-400/50">
                                <PackageCheck className="w-5 h-5 text-emerald-700" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-muted-foreground">Total Orders</h3>
                                <p className="text-3xl">{arrivedQuery.data?.count}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <ShippingReport />
                </div>
            </div>
            
        </>
    )
}

export default Dashboard
