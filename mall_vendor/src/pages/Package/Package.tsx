import { Button } from "@/components/ui/button"
import useAxiosToken from "@/hooks/useAxiosToken"
import { FormattedDate, FormattedTime } from "@/lib/helper"
import { Package } from "@/lib/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Edit } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import EditPackage from "./EditPackage"
import EditLoaded from "./EditLoaded"
import EditReceived from "./EditReceived"
import EditEta from "./EditEta"

const PackageDetails = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const packageDetail = useQuery<Package>({
        queryKey: ["package", id],
        queryFn: async() => await axios_instance_token.get(`/packages/${id}`).then(res => {
            return res.data
        })
    })

    const updatePackage = async (status:string) => {
        const response = await axios_instance_token.patch(`/packages/${id}/status`, {
            status
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: updatePackage,
        onSuccess: ()=>{
            toast.success("Package updated successfully", {
                id: "package-update"
            })

            queryClient.invalidateQueries({queryKey: ["package", id]})
            queryClient.invalidateQueries({queryKey: ["packages"]})
            
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "package-update"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "package-update"
                })
            }
        }
    })

    const onPackageUpdate = (data:string)=>{
        toast.loading("Updating Package ...", {
            id: "package-update"
        })
        mutate(data)
    }
    
    return (
        <div className="container mx-auto">
            <div className="flex justify-between flex-wrap mb-4 lg:mb-0 px-4 mt-4">
                <div className="flex flex-wrap gap-4 ">
                    <button onClick={()=> navigate(-1)} className="flex items-center justify-center w-12 h-12 border rounded-full text-gray-400 hover:text-gray-600 hover:border-gray-600">
                        &larr;
                    </button>
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h4 className="text-3xl font-semibold mb-2">Package ID: #{id}</h4>
                                <p>Tracking Number: {packageDetail.data?.trackingNumber}</p>
                            </div>
                            <span className={`${packageDetail.data?.status === "ON_HOLD" && 'bg-gray-300'} ${packageDetail.data?.status === "ARRIVED" && 'bg-emerald-300 text-emerald-700'} ${packageDetail.data?.status === "EN_ROUTE" && 'bg-yellow-300 text-yellow-700'} ${packageDetail.data?.status === "DELIVERED" && 'bg-blue-300 text-blue-700'} py-1 px-4 rounded-full text-xs`}>{packageDetail.data?.status}</span>
                        </div>
                        <p className="mb-2 text-xs lg:text-sm text-muted-foreground">{FormattedDate(new Date(packageDetail.data?.createdAt as string))} at {FormattedTime(new Date(packageDetail.data?.createdAt as string))} from drafts</p>
                    </div>
                </div>
                <div className="flex flex-col flex-wrap justify-self-end gap-2">
                    <div className="flex flex-wrap gap-2">
                        <EditLoaded trackingNumber={packageDetail.data?.trackingNumber as string} date={packageDetail.data?.loaded as string} id={Number(id)} trigger={<Button variant={"outline"}><Edit className="w-4 h-4"/>Loaded</Button>} />
                        <EditReceived trackingNumber={packageDetail.data?.trackingNumber as string} date={packageDetail.data?.received as string} id={Number(id)} trigger={<Button variant={"outline"}><Edit className="w-4 h-4"/>Received</Button>} />
                        <EditEta trackingNumber={packageDetail.data?.trackingNumber as string} date={packageDetail.data?.eta as string} id={Number(id)} trigger={<Button variant={"outline"}><Edit className="w-4 h-4"/>ETA</Button>} />
                        {packageDetail.data && <EditPackage item={packageDetail.data}  trigger={<Button variant={"outline"}><Edit className="w-4 h-4"/>Package</Button>} /> }
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {packageDetail.data?.status !== "ON_HOLD" && <Button className="border bg-gray-700 hover:bg-gray-500" onClick={()=>{onPackageUpdate("ON_HOLD")}} disabled={isPending}>On Hold</Button>}
                        {packageDetail.data?.status !== "EN_ROUTE" && <Button className="border bg-yellow-700 hover:bg-yellow-500" onClick={()=>{onPackageUpdate("EN_ROUTE")}} disabled={isPending}>En Route</Button>}
                        {packageDetail.data?.status !== "ARRIVED" && <Button className="border bg-emerald-700 hover:bg-emerald-500" onClick={()=>{onPackageUpdate("ARRIVED")}} disabled={isPending}>Arrived</Button>}
                        {packageDetail.data?.status !== "DELIVERED" && <Button className="border bg-blue-700 hover:bg-blue-500" onClick={()=>{onPackageUpdate("DELIVERED")}} disabled={isPending}>Delivered</Button>}
                    </div>
                    
                </div>
            </div>
            <div className="px-4 flex flex-wrap gap-8 mt-8">
                <div>
                    <h4 className='text-xs text-gray-400 mb-2 '>Customer name</h4>
                    <p>{packageDetail.data?.customer}</p>
                </div>
                <div>
                    <h4 className='text-xs text-gray-400 mb-2 '>Customer email</h4>
                    <p>{packageDetail.data?.email}</p>
                </div>
                <div>
                    <h4 className='text-xs text-gray-400 mb-2 '>Customer phone</h4>
                    <p>{packageDetail.data?.phone}</p>
                </div>
                <div>
                    <h4 className='text-xs text-gray-400 mb-2 '>Status</h4>
                    <p>{packageDetail.data?.status}</p>
                </div>
            </div>
            <div className="px-4 flex flex-wrap gap-8 mt-8">
                <div>
                    <h4 className='text-xs text-gray-400 mb-2'>Package</h4>
                    <p>{packageDetail.data?.package}</p>
                </div>
                <div>
                    <h4 className='text-xs text-gray-400 mb-2'>CBM</h4>
                    <p>{packageDetail.data?.cbm}</p>
                </div>
                <div>
                    <h4 className='text-xs text-gray-400 mb-2'>Quantity</h4>
                    <p>{packageDetail.data?.quantity}</p>
                </div>
                <div>
                    <h4 className='text-xs text-gray-400 mb-2'>Received</h4>
                    <p>{packageDetail.data?.received ? new Date(packageDetail.data?.received).toDateString() : "-"}</p>
                </div>
                <div>
                    <h4 className='text-xs text-gray-400 mb-2'>Loaded</h4>
                    <p>{packageDetail.data?.loaded ? new Date(packageDetail.data?.loaded).toDateString() : "-"}</p>
                </div>
                <div>
                    <h4 className='text-xs text-gray-400 mb-2'>ETA</h4>
                    <p>{packageDetail.data?.eta ? new Date(packageDetail.data?.eta).toDateString() : "-"}</p>
                </div>
                <div>
                    <h4 className='text-xs text-gray-400 mb-2'>Vessel Line</h4>
                    <p>{packageDetail.data?.vessel ? packageDetail.data?.vessel : "-"}</p>
                </div>
            </div>
            <div className="px-4 flex flex-wrap gap-8 mt-8">
                <div>
                    <h4 className='text-xs text-gray-400 mb-2'>Notes</h4>
                    <p>{packageDetail.data?.description ? packageDetail.data?.description : "-"}</p>
                </div>
            </div>
        </div>
    )
}

export default PackageDetails
