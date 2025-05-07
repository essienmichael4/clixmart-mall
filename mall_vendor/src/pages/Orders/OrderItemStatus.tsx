import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

interface OrderItemStatusProps{
    store: string,
    status:string,
    id: string,
    itemId: string
}

const OrderItemStatus = ({store, status, id, itemId}:OrderItemStatusProps) => {
    const queryClient = useQueryClient()
    const axios_instance_token = useAxiosToken()

    const editProductReviewStatus = async (data:string)=>{
        const response = await axios_instance_token.patch(`/orders/${store}/${id}/${itemId}/status`, {
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

            queryClient.invalidateQueries({queryKey: ["orders", {id, itemId}]})

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

    const handleStatusChange = (data:string)=>{
        console.log(data);
        
        toast.loading("Editing status...", {
            id: "edit-status"
        })
        mutate(data)
    }

    return (
        <div className="">
            <p className="text-xs mb-1">Item Status</p>
            <Select onValueChange={(value)=>handleStatusChange(value)} disabled={isPending}>
                <SelectTrigger className="w-[110px] text-sm">
                    <SelectValue placeholder={status} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                    <SelectItem value="SHIPPING">SHIPPING</SelectItem>
                    <SelectItem value="SHIPPED">SHIPPED</SelectItem>
                    <SelectItem value="RETURNED">RETURNED</SelectItem>
                    <SelectItem value="FAILED">FAILED</SelectItem>
                    <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export default OrderItemStatus
