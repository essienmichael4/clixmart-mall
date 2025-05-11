import Dropzone from '@/components/Dropzone'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import useAxiosToken from '@/hooks/useAxiosToken'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'


interface Props{
    trigger?: React.ReactNode,
    id:number,
    // name:string,
    // imageUrl?: string
}

const CategoryImageDialog = ({id, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const [image, setImage] = useState<File | undefined>()

    const handleFileChange = useCallback((value:File | undefined)=>{
        setImage(value)
    }, [])

    const addCategoryImage = async ()=>{
        if(!image){
            toast.error("Please hoose an image to upload", {
                id: "create-order"
            })
            return
        }

        const formData = new FormData()
        formData.append("file", image)
        const response = await axios_instance_token.post(`/categories/${id}/upload`, formData, {
            headers: {
                "content-type": "multipart/form-data",
            }
        })

        return response.data
    }
    
    const {mutate, isPending} = useMutation({
        mutationFn: addCategoryImage,
        onSuccess: ()=>{
            toast.success("Product image added successfully", {
                id: "add-image"
            })

            queryClient.invalidateQueries({queryKey: ["categories", id]})
            
            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "add-image"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "add-image"
                })
            }
        }
    })
    
    const onSubmit = ()=>{
        toast.loading("Adding Product Image...", {
            id: "add-image"
        })
        mutate()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle className='capitalize'>
                        Edit Category
                    </DialogTitle>
                </DialogHeader>

                <Dropzone handleFileChange={handleFileChange} title='Category Image' />

                <DialogFooter >
                <DialogClose asChild>
                    <Button 
                        type='button'
                        variant={"secondary"}
                        >
                            Cancel
                    </Button>
                </DialogClose>
                <Button onClick={()=>onSubmit()} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                >
                    {!isPending && "Update category"}
                    {isPending && <Loader2 className='animate-spin' /> }
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    )
}

export default CategoryImageDialog