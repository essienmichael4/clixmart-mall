import React, { useCallback, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import ProductSecondaryImages from '@/components/ProductSecondaryImages'

interface Props{
    trigger?: React.ReactNode,
    id:number,
}

const SecondaryImages = ({ id, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const [images, setImages] = useState<File[] | undefined>()
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const handleFilesChange = useCallback((value:File[] | undefined)=>{
        let allFiles = images
        value?.map(_e => {
            allFiles?.push(_e)
        })
        setImages(allFiles)
    }, [])


    const addProductImages = async ()=>{
        if(!images){
            toast.error("Please choose images to upload", {
                id: "create-order"
            })
            return
        }

        const formData = new FormData()
        for(const image of images){
            formData.append("files", image)
        }
        const response = await axios_instance_token.post(`/products/${id}/uploads`, formData, {
            headers: {
              "content-type": "multipart/form-data",
            }
        })

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addProductImages,
        onSuccess: ()=>{
            toast.success("Images added successfully", {
                id: "add-images"
            })

            queryClient.invalidateQueries({queryKey: ["products", id]})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "add-images"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "add-images"
                })
            }
        }
    })

    const onSubmit = ()=>{
        toast.loading("Adding images...", {
            id: "add-images"
        })
        mutate()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Edit Package
                    </DialogTitle>
                </DialogHeader>
                <div >   
                    <ProductSecondaryImages handleFileChange={handleFilesChange} />
                </div>
                <DialogFooter >
                    <DialogClose asChild>
                        <Button 
                            type='button'
                            variant={"secondary"}
                            onClick={()=>{
                                // form.reset()
                            }} >
                                Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={()=>{onSubmit()}} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                    >
                        {!isPending && "Update Received"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SecondaryImages
