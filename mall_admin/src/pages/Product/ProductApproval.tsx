import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

interface ProductApprovalProps{
    approval:string,
    id: number
}

const ProductApproval = ({approval, id}:ProductApprovalProps) => {
    const queryClient = useQueryClient()
    const axios_instance_token = useAxiosToken()

    const editProductReviewStatus = async (data:string)=>{
        const response = await axios_instance_token.patch(`/productS/${id}/approval`, {
            status: data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: editProductReviewStatus,
        onSuccess: ()=>{
            toast.success("Status updated successfully", {
                id: "edit-status"
            })

            queryClient.invalidateQueries({queryKey: ["product", id]})

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

    const handleApprovalStatusChange = (data:string)=>{
        console.log(data);
        
        toast.loading("Editing status...", {
            id: "edit-status"
        })
        mutate(data)
    }

    return (
        <div className="absolute right-4 top-2">
            <p className="text-xs mb-1">Product Approval</p>
            <Select onValueChange={(value)=>handleApprovalStatusChange(value)} disabled={isPending}>
                <SelectTrigger className="w-[110px] text-sm">
                    <SelectValue placeholder={approval} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="APPROVED">APPROVED</SelectItem>
                    <SelectItem value="REJECTED">REJECTED</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export default ProductApproval
