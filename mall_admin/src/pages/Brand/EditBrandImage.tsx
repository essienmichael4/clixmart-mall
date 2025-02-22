import React, { useCallback, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { Brand } from '@/lib/types'
import Dropzone from '@/components/Dropzone'

interface Props{
    trigger?: React.ReactNode,
    item:Brand,
}

const EditBrand = ({item, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const [image, setImage] = useState<File | undefined>()
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const handleFileChange = useCallback((value:File | undefined)=>{
        setImage(value)
    }, [])

    const addBrand = async ()=>{
        if(!image) return

        const formData = new FormData()
        formData.append("file", image)

        const response = await axios_instance_token.post(`/brands/${item.id}/upload`, formData, {
            headers: {
              "content-type": "multipart/form-data",
            }
        })

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addBrand,
        onSuccess: ()=>{
            toast.success("Brand updated successfully", {
                id: "edit-brand"
            })

            queryClient.invalidateQueries({queryKey: ["brands"]})
            

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "edit-brand"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "edit-brand"
                })
            }
        }
    })

    const onSubmit = ()=>{
        toast.loading("Editing brand image...", {
            id: "edit-brand"
        })
        mutate()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle className='capitalize'>
                        Edit {item.name} Brand Image
                    </DialogTitle>
                </DialogHeader>
                <Dropzone handleFileChange={handleFileChange} />
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
                        {!isPending && "Update brand"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditBrand
