import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '../../components/ui/form'
import { Button } from '../../components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { CircleOff, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { EditBrandSchema, EditBrandSchemaType } from '@/schema/brand'
import { Brand } from '@/lib/types'
import BrandImageDialog from './BrandImageDialog'

interface Props{
    trigger?: React.ReactNode,
    item:Brand,
}

const EditBrand = ({item, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<EditBrandSchemaType>({
        resolver:zodResolver(EditBrandSchema),
        defaultValues:{
            name: item.name
        }
    })

    const addBrand = async (data:EditBrandSchemaType)=>{
        const response = await axios_instance_token.patch(`/brands/${item.id}`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addBrand,
        onSuccess: ()=>{
            toast.success("Brand updated successfully", {
                id: "edit-category"
            })

            queryClient.invalidateQueries({queryKey: ["brands"]})
            form.reset({
                name: item.name
            })

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

    const onSubmit = (data:EditBrandSchemaType)=>{
        toast.loading("Editing Category...", {
            id: "edit-category"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle className='capitalize'>
                        Edit Brand
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2 w-full'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) =>(
                                <FormItem className='flex-1 px-2 space-y-2'>
                                    <FormLabel className='text-xs'>Brand</FormLabel>
                                    <FormControl>
                                        <Input className='capitalize' {...field} />
                                    </FormControl>
                                    <FormDescription>Brand for product groupings.</FormDescription>
                                </FormItem>
                            )} 
                        />

                        <FormField
                            name='Image'
                            render={()=>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Brand image</FormLabel>
                                    <FormControl>
                                        <BrandImageDialog id={item.id} trigger={

                                            <Button variant={'outline'} className='h-[100px] w-full'>
                                                {item.imageUrl ? 
                                                    <div className='flex flex-col items-center gap-2'>
                                                        <img src={item.imageUrl} role='image'  className='w-20 h-20'/>
                                                        <p className='text-xs text-muted-foreground'>Click to change</p>
                                                    </div>
                                                    : 
                                                    <div className='flex flex-col items-center gap-2'>
                                                        <CircleOff  className='w-20 h-20'/>
                                                        <p className='text-xs text-muted-foreground'>Click to add</p>
                                                    </div>
                                                }
                                            </Button>
                                            }
                                        />
                                            
                                    </FormControl>
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
                                form.reset()
                            }} >
                                Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
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
