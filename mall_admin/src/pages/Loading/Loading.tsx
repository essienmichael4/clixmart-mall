import { Edit, Loader2, Plus, Trash2 } from "lucide-react"
import AddLoading from "./AddLoading"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { LoadingType } from "@/lib/types"
import EditLoading from "./EditLoading"
import DeleteLoading from "./DeleteLoading"
import { toast } from "sonner"
import axios from "axios"
import { useState } from "react"

interface UpdateProps{
    status: string,
    id:number
}

const Loading = () => {
    const [status, setStatus] = useState("")
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const loadings = useQuery<LoadingType[]>({
        queryKey: ["loadings", status],
        queryFn: async() => await axios_instance_token.get(`/loadings?status=${status}`).then(res => res.data)
    })

    const updateLoading = async (data:UpdateProps) => {
        const response = await axios_instance_token.patch(`/loadings/${data.id}/status`, {
            status: data.status
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: updateLoading,
        onSuccess: ()=>{
            toast.success("Container loading updated successfully", {
                id: "loading-update"
            })

            queryClient.invalidateQueries({queryKey: ["loadings"]})
            
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "loading-update"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "loading-update"
                })
            }
        }
    })

    const onLoadingUpdate = (data:UpdateProps)=>{
        toast.loading("Updating container loading ...", {
            id: "loading-update"
        })
        mutate(data)
    }

    const dataAvailable = loadings.data && loadings.data.length > 0
    
    return (
        <>
            <div className="container px-4 mx-auto">
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex flex-wrap gap-4 items-center">
                        <h3 className="font-bold">Container Loadings</h3>
                        <div className="flex gap-2 flex-wrap">
                            <button onClick={()=> setStatus("")} className={`${status === "" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>All</button>
                            <button  onClick={()=> setStatus("IN_TRANSIT")} className={`${status === "IN_TRANSIT" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>In Transit</button>
                            <button  onClick={()=> setStatus("ARRIVED")} className={`${status === "ARRIVED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Arrived</button>
                            <button  onClick={()=> setStatus("DELIVERED")} className={`${status === "DELIVERED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Delivered</button>
                        </div>
                    </div>
                    <div>
                        <AddLoading trigger={
                        <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                            <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add Loading</span>
                        </button>}
                        />
                    </div>
                </div>
                <div className="w-full mt-4 flex flex-col gap-4">
                    {
                        !dataAvailable && 
                        <div className='bg-gray-100 rounded-lg h-[300px] flex flex-col items-center justify-center'>
                            <p className='text-center'>No container loadings have been added yet.</p>
                        </div>
                    }
                    {
                    dataAvailable &&
                        loadings?.data.map((item, i)=>(
                        <div key={i} className="p-4 border rounded-md flex flex-wrap gap-4 items-center justify-between">
                            <div>
                                <div className="flex gap-2 items-center">
                                    <p>Loaded - {item.loaded}</p> <span className="text-xs py-2 px-4 bg-emerald-200 rounded-full text-emerald-700">{item.status}</span>
                                </div>
                                <h5 className="text-3xl mt-2">{item.vessel}</h5>
                            </div>
                            <div className="ml-8">
                                <span className="text-xs">ETA</span>
                                <p className="text-xl">{item.eta}</p>
                            </div>
                            <div className="ml-8">
                                <span className="text-xs">Status Actions</span>
                                <div className="flex items-center gap-4">
                                    {item.status === "IN_TRANSIT" && <button onClick={()=>onLoadingUpdate({status:item.status, id:item.id})} disabled={isPending}  className="py-2 px-4 bg-emerald-200 rounded-full text-emerald-700 text-xs">
                                        {!isPending && "IN TRANSIT"}
                                        {isPending && <Loader2 className='animate-spin' /> }
                                        </button>
                                    }
                                    {item.status === "ARRIVED" && <button onClick={()=>onLoadingUpdate({status:item.status, id:item.id})} disabled={isPending}  className="py-2 px-4 bg-blue-200 rounded-full text-blue-700 text-xs">
                                        {!isPending && "ARRIVED"}
                                        {isPending && <Loader2 className='animate-spin' /> }
                                        </button>}
                                    {item.status === "DELIVERED" && <button onClick={()=>onLoadingUpdate({status:item.status, id:item.id})} disabled={isPending}  className="py-2 px-4 bg-rose-200 rounded-full text-rose-700 text-xs">
                                        {!isPending && "DELIVERED"}
                                        {isPending && <Loader2 className='animate-spin' /> }
                                        </button>}
                                </div>
                            </div>
                            <div className="">
                                <span className="text-xs">Actions</span>
                                <div className="flex items-center gap-4 mt-2">
                                    <EditLoading item={item} trigger={<button><Edit className="w-4 h-4 text-emerald-400"/></button>} />
                                    <DeleteLoading id={item.id} trigger={<button><Trash2 className="w-4 h-4 text-rose-400"/></button>} />
                                </div>
                            </div>
                        </div>)
                    )}
                </div>
            </div>
        </>
    )
}

export default Loading
