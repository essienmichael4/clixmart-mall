import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { CategorySchema, CategorySchemaType } from '@/schema/category'
import { Category } from '@/lib/types'

interface Props{
    trigger?: React.ReactNode,
    successCallback?: (category:Category)=>void
}

const CreateCategory = ({trigger, successCallback}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<CategorySchemaType>({
        resolver:zodResolver(CategorySchema),
        defaultValues:{
            name: "",
        }
    })

    const addCategory = async (data:CategorySchemaType)=>{
        const response = await axios_instance_token.post(`/categories`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addCategory,
        onSuccess: (data:Category)=>{
            toast.success(`Category ${data.name} created successfully`, {
                id: "add-category"
            })

            form.reset({
                name: ""
            })
            successCallback && successCallback(data)
            queryClient.invalidateQueries({queryKey: ["categories"]})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "add-category"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "add-category"
                })
            }
        }
    })

    const onSubmit = (data:CategorySchemaType)=>{
        toast.loading("Creating category...", {
            id: "add-category"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Create Category
                    </DialogTitle>
                    <DialogDescription>
                        Category is used to group products
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) =>(
                                <FormItem className='flex-1 px-2 space-y-2'>
                                    <FormLabel className='text-xs'>Category name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>Category name for product groupings.</FormDescription>
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
                        {!isPending && "Create Category"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateCategory
