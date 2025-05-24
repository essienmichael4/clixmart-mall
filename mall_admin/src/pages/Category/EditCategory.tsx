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
import { EditCategorySchema, EditCategorySchemaType } from '@/schema/category'
import { Input } from '@/components/ui/input'
import CategoryImageDialog from './CategoryImageDialog'

interface Props{
    trigger?: React.ReactNode,
    id:number,
    name:string,
    imageUrl?: string
}

const EditCategory = ({id, name, trigger, imageUrl}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<EditCategorySchemaType>({
        resolver:zodResolver(EditCategorySchema),
        defaultValues:{
            name: name
        }
    })

    const addCategory = async (data:EditCategorySchemaType)=>{
        const response = await axios_instance_token.patch(`/categories/${id}`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addCategory,
        onSuccess: ()=>{
            toast.success("Category updated successfully", {
                id: "edit-Category"
            })

            queryClient.invalidateQueries({queryKey: ["categories"]})
            form.reset({
                name: name
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

    const onSubmit = (data:EditCategorySchemaType)=>{
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
                        Edit Category
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2 w-full'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) =>(
                                <FormItem className='flex-1 space-y-2'>
                                    <FormLabel className='text-xs'>Category name</FormLabel>
                                    <FormControl>
                                        <Input className='capitalize' {...field} />
                                    </FormControl>
                                    <FormDescription>Category name for product groupings.</FormDescription>
                                </FormItem>
                            )} 
                        />

                        <FormField
                            name='Image'
                            render={()=>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Category image</FormLabel>
                                    <FormControl>
                                        <CategoryImageDialog id={id} trigger={

                                            <Button variant={'outline'} className='h-[100px] w-full'>
                                                {imageUrl ? 
                                                    <div className='flex flex-col items-center gap-2'>
                                                        <div className='w-[50px] h-[50px] overflow-hidden rounded-lg'>
                                                            <img src={imageUrl} role='image'  className='w-full h-full'/>
                                                        </div>
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
                        {!isPending && "Update category"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditCategory
