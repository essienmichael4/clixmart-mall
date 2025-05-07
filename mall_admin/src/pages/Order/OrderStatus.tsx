import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

interface OrderStatusProps{
    status:string,
    id: string
}

const OrderStatus = ({status, id}:OrderStatusProps) => {
    const queryClient = useQueryClient()
    const axios_instance_token = useAxiosToken()

    const editProductReviewStatus = async (data:string)=>{
        const response = await axios_instance_token.patch(`/orders/${id}/status`, {
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

            queryClient.invalidateQueries({queryKey: ["orders", id]})

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
        <div className="absolute right-4 top-2">
            <p className="text-xs mb-1">Order Status</p>
            <Select onValueChange={(value)=>handleStatusChange(value)} disabled={isPending}>
                <SelectTrigger className="w-[110px] text-sm">
                    <SelectValue placeholder={status} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    {/* <SelectItem value="APPROVED">APPROVED</SelectItem> */}
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

export default OrderStatus
