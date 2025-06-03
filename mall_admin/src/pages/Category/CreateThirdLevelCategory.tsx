import React, { useCallback, useState } from 'react'
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
import { SubCategorySchema, SubCategorySchemaType } from '@/schema/category'
import SecondLevelCategoryPicker from './SecondLevelCategoryPicker'

interface Props{
    trigger?: React.ReactNode,
}

const CreateThirdLevelCategory = ({trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<SubCategorySchemaType>({
        resolver:zodResolver(SubCategorySchema),
        defaultValues:{
            name:""
        }
    })

    const handleCategoryChange = useCallback((value:string)=>{
        form.setValue("category", value)
    }, [form])

    const createSubCategory = async (data:SubCategorySchemaType)=>{
        const response = await axios_instance_token.post(`/categories/second-level-sub-categories`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: createSubCategory,
        onSuccess: ()=>{
            toast.success("Sub category added successfully", {
                id: "add-sub-category"
            })

            form.reset({
               name: "",
               category: ""
            })

            queryClient.invalidateQueries({queryKey: ["categories"]})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "add-sub-category"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "add-sub-category"
                })
            }
        }
    })

    const onSubmit = (data:SubCategorySchemaType)=>{
        toast.loading("Creating Sub-Category...", {
            id: "add-sub-category"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Create Third-Level Category
                    </DialogTitle>
                    <DialogDescription>
                        Sub Category is used to furthur group your products
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                        <FormField 
                            control={form.control}
                            name="category"
                            render={({}) =>(
                                <FormItem className='flex flex-col px-1'>
                                    <FormLabel className='text-xs'>Second-Level Category</FormLabel>
                                    <FormControl>
                                        <SecondLevelCategoryPicker onChange={handleCategoryChange}/>
                                    </FormControl>
                                    <FormDescription>Select a category</FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) =>(
                                <FormItem className='flex-1 px-1'>
                                    <FormLabel className='text-xs'>Third-Level Category Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>Sub category name for product groupings.</FormDescription>
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
                        {!isPending && "Add Sub Category"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateThirdLevelCategory
