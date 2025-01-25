import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

interface Props{
    trigger?: React.ReactNode,
    id:number,
    name:string
}

const DeleteCategory = ({id, name, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    

    const addCategory = async ()=>{
        const response = await axios_instance_token.delete(`/categories/${id}`)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addCategory,
        onSuccess: ()=>{
            toast.success("Category deleted successfully", {
                id: "edit-category"
            })

            queryClient.invalidateQueries({queryKey: ["categories"]})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "edit-category"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "edit-category"
                })
            }
        }
    })

    const onSubmit = ()=>{
        toast.loading("Deleting Category...", {
            id: "edit-category"
        })
        mutate()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle className='capitalize'>
                        Delete Category: {name}
                    </DialogTitle>
                </DialogHeader>
                <div>
                    Are you sure you want to delete this category? Note that this action cannot be reversed.
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
                        {!isPending && "Delete Category"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteCategory
