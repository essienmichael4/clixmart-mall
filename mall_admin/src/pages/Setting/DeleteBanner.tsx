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
    id:string | undefined
}

const DeleteBanner = ({trigger, id}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const addCategory = async ()=>{
        const response = await axios_instance_token.post(`/settings/banners/${id}`,)
        return response.data
    }    

    const {mutate, isPending} = useMutation({
        mutationFn: addCategory,
        onSuccess: ()=>{
            toast.success(`Banner deleted successfully`, {
                id: "delete-banner"
            })

            queryClient.invalidateQueries({queryKey: ["banners"]})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "delete-banner"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "delete-banner"
                })
            }
        }
    })

    const onSubmit = ()=>{
        toast.loading("Deleting banner...", {
            id: "delete-banner"
        })
        mutate()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Delete Banner
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <p>Are you sure you want to delete this banner? This action is not reversible. You may continue to delete whenever you are ready. </p>
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
                        {!isPending && "Delete Banner"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteBanner
