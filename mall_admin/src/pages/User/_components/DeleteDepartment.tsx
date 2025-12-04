import { DialogHeader, DialogFooter, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog"
import useAxiosToken from "@/hooks/useAxiosToken"
import { Department } from "@/lib/types"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"


interface DeleteDepartmentProps {
    department: Department,
    trigger?: React.ReactNode,
}

const DeleteDepartment = ({department, trigger}:DeleteDepartmentProps) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const deleteDepartment = async ()=>{
        const response = await axios_instance_token.delete(`/departments/${department.id}`)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: deleteDepartment,
        onSuccess: ()=>{
            toast.success("Department deleted successfully", {
                id: "delete-department"
            })

            queryClient.invalidateQueries({queryKey: ["departments"]})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "delete-department"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "delete-department"
                })
            }
        }
    })

    const onSubmit = ()=>{
        toast.loading("Deleting department...", {
            id: "delete-department"
        })
        mutate()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Delete Department
                    </DialogTitle>
                </DialogHeader>
                <div>
                    Are you sure you want to delete this ({department.name}) department?
                </div>
                <DialogFooter >
                    <DialogClose asChild>
                        <Button 
                            type='button'
                            variant={"secondary"}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={onSubmit} disabled={isPending} className='bg-gradient-to-r from-rose-500 to-rose-800 text-white'
                    >
                        {!isPending && "Delete Department"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteDepartment
