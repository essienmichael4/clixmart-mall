import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../../components/ui/form'
import { Button } from '../../components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { Store } from '@/lib/types'
import { Textarea } from '@/components/ui/textarea'
import { EditStoreReviewSchema, EditStoreReviewSchemaType } from '@/schema/store'
import StatusPicker from '@/components/StatusPicker'

interface Props{
    trigger?: React.ReactNode,
    item:Store
}

const EditStoreReview = ({item, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const [description, setDescription] = useState(item.storeReview?.description)
    const queryClient = useQueryClient()

    const form = useForm<EditStoreReviewSchemaType>({
        resolver:zodResolver(EditStoreReviewSchema),
        defaultValues:{
            status: item?.storeReview?.status,
        }
    })

    const handleStatusChange = (value:"PENDING" | "APPROVED" | "REJECTED")=>{
        form.setValue("status", value)        
    }

    const addStoreReview = async (data:EditStoreReviewSchemaType)=>{
        const response = await axios_instance_token.patch(`/stores/${item.id}/store-review`, {
            ...data,
            description
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addStoreReview,
        onSuccess: ()=>{
            toast.success("Store review status updated successfully", {
                id: "edit-package"
            })

            queryClient.invalidateQueries({queryKey: ["vendors"]})

            form.reset({
                status: item.storeReview?.status,
            })
            setDescription(item.storeReview?.description)

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

    const onSubmit = (data:EditStoreReviewSchemaType)=>{
        toast.loading("Updating store review status...", {
            id: "edit-package"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle className='capitalize'>
                        Edit Store Review: {item.name}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                        <FormField
                            control={form.control}
                            name="status"
                            render={({}) =>(
                                <FormItem className='flex-1 px-1'>
                                    <FormLabel className='text-xs'>Status</FormLabel>
                                    <FormControl>
                                        <StatusPicker status={item.storeReview!.status} onChange={handleStatusChange} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />

                        <FormField 
                            // control={form.control}
                            name="description"
                            render={({field}) =>(
                                <FormItem className='flex mt-y flex-col px-2'>
                                    <FormLabel className='mr-2 text-xs 2xl:text-sm font-bold'>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    {/* <FormDescription>Special notes for delivery.</FormDescription> */}
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter >
                    <DialogClose asChild>
                        <Button 
                            type='button'
                            variant={"secondary"}
                            onClick={()=>{
                                form.reset({
                                    status: item.storeReview?.status,
                                })
                                setDescription(item.storeReview?.description)
                            }} >
                                Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                    >
                        {!isPending && "Edit Review"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditStoreReview
