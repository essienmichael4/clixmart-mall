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
import { Loader2 } from 'lucide-react'
import { EditCategorySchema, EditCategorySchemaType } from '@/schema/category'
import { Input } from '@/components/ui/input'

interface Props{
    trigger?: React.ReactNode,
    id:number,
    name:string
}

const EditSubCategory = ({id, name, trigger}:Props) => {
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
        const response = await axios_instance_token.patch(`/categories/sub-categories/${id}`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addCategory,
        onSuccess: ()=>{
            toast.success("Sub-Category updated successfully", {
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
        toast.loading("Editing sub category...", {
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
                        Edit Sub-Category
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2 w-full'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) =>(
                                <FormItem className='flex-1 px-2 space-y-2'>
                                    <FormLabel className='text-xs'>Sub-Category name</FormLabel>
                                    <FormControl>
                                        <Input className='capitalize' {...field} />
                                    </FormControl>
                                    <FormDescription>Sub-category name for product groupings.</FormDescription>
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
                        {!isPending && "Update sub-category"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditSubCategory
