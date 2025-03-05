import React, { useCallback, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form'
import { Button } from '../../components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { EditPackageEtaSchema, EditEtaSchemaType} from '@/schema/package'
import Dropzone from '@/components/Dropzone'

interface Props{
    trigger?: React.ReactNode,
    id:number
}

const PrimaryImage = ({ id, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const [image, setImage] = useState<File | undefined>()
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const handleFileChange = useCallback((value:File | undefined)=>{
        setImage(value)
    }, [])
    // const form = useForm<PrimaryImageSchemaType>({
    //     resolver:zodResolver(EditPackageEtaSchema),
    //     defaultValues:{
    //         eta: new Date()
    //     }
    // })

    const addPackage = async (data:any)=>{
        const response = await axios_instance_token.patch(`/packages/${id}/eta`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addPackage,
        onSuccess: ()=>{
            toast.success("Package updated successfully", {
                id: "edit-package"
            })

            // queryClient.invalidateQueries({queryKey: ["package", id]})
            // queryClient.invalidateQueries({queryKey: ["packages"]})
            

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "edit-package"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "edit-package"
                })
            }
        }
    })

    const onSubmit = (data: any)=>{
        toast.loading("Editing package...", {
            id: "edit-package"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Edit Package: 
                    </DialogTitle>
                </DialogHeader>
                
                <div className=''>    
                    <Dropzone handleFileChange={handleFileChange}/>
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
                    <Button onClick={()=>{}} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                    >
                        {!isPending && "Update ETA"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PrimaryImage
