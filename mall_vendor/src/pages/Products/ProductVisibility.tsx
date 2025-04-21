import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

interface ProductVisibilityProps{
    visibility:string,
    id: string
}

const ProductVisibility = ({visibility, id}:ProductVisibilityProps) => {
    const queryClient = useQueryClient()
    const axios_instance_token = useAxiosToken()

    const editProductStatus = async (data:string)=>{
        const response = await axios_instance_token.patch(`/productS/${id}/status`, {
            status: data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: editProductStatus,
        onSuccess: ()=>{
            toast.success("Status updated successfully", {
                id: "edit-status"
            })

            queryClient.invalidateQueries({queryKey: ["product", id]})
            queryClient.invalidateQueries({queryKey: ["products"]})

        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "edit-status"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "edit-status"
                })
            }
        }
    })

    const handleVisibilityStatusChange = (data:string)=>{
        console.log(data);
        
        toast.loading("Editing status...", {
            id: "edit-status"
        })
        mutate(data)
    }

    return (
        <div className="absolute right-4 top-2">
            <p className="text-xs mb-1">Product visibility</p>
            <Select onValueChange={(value)=>handleVisibilityStatusChange(value)} disabled={isPending}>
                <SelectTrigger className="w-[110px] text-sm">
                    <SelectValue placeholder={visibility} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="DRAFT">DRAFT</SelectItem>
                    <SelectItem value="PUBLISH">PUBLISH</SelectItem>
                    <SelectItem value="ARCHIVE">ARCHIVE</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export default ProductVisibility