import React, { useCallback, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { Store } from '@/lib/types'
import StoreDropzone from './StoreDropzone'

interface Props{
    trigger?: React.ReactNode,
    item:Store,
}

const EditStoreImage = ({item, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const [image, setImage] = useState<File | undefined>()
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const handleFileChange = useCallback((value:File | undefined)=>{
        setImage(value)
    }, [])

    const addStore = async ()=>{
        if(!image) return

        const formData = new FormData()
        formData.append("file", image)

        const response = await axios_instance_token.post(`/stores/${item.id}/upload`, formData, {
            headers: {
              "content-type": "multipart/form-data",
            }
        })

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addStore,
        onSuccess: ()=>{
            toast.success("Store image updated successfully", {
                id: "edit-image"
            })

            queryClient.invalidateQueries({queryKey: ["stores", item.id]})
            

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "edit-image"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "edit-image"
                })
            }
        }
    })

    const onSubmit = ()=>{
        toast.loading("Editing store image...", {
            id: "edit-image"
        })
        mutate()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle className='capitalize'>
                        Edit {item.name} Image
                    </DialogTitle>
                </DialogHeader>
                <StoreDropzone handleFileChange={handleFileChange} />
                <DialogFooter >
                    <DialogClose asChild>
                        <Button 
                            type='button'
                            variant={"secondary"}
                            onClick={()=>{
                                
                            }} >
                                Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={()=>onSubmit()} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                    >
                        {!isPending && "Update Store Image"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditStoreImage
