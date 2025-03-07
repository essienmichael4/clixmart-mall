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
import { CategorySchema, CategorySchemaType } from '@/schema/category'
import { Category } from '@/lib/types'
import SubCategoriesPicker from '../Category/SubCategoriesPicker'
import CategoriesPicker from '../Category/CategoriesPicker'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Props{
    trigger?: React.ReactNode,
    successCallback?: (category:Category)=>void
}

const CreateBrand = ({trigger, successCallback}:Props) => {
    const [open, setOpen] = useState(false)
    const [category, setCategory] = useState<string[]>([])
    const [subCategory, setSubCategory] = useState<string[]>([])
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<CategorySchemaType>({
        resolver:zodResolver(CategorySchema),
        defaultValues:{
            name: "",
        }
    })

    const addCategory = async (data:CategorySchemaType)=>{
        const response = await axios_instance_token.post(`/brands`, {
            ...data,
            category: category,
            subCategory: subCategory
        },)

        return response.data
    }

    const handleCategoryChange = useCallback((value:string)=>{
        if(category.includes(value)) return
        setCategory(prev=> [...prev,value])
    }, [form])

    const handleSubCategoryChange = useCallback((value:string)=>{
        if(subCategory.includes(value)) return
        setSubCategory(prev=> [...prev,value])
        
    }, [form])

    const removeCategoriesTag = (index:number) =>{
        setCategory(prevTags => {
          return prevTags.filter((_, i)=> i != index)
        })
    }

    const removeSubCategoriesTag = (index:number) =>{
        setSubCategory(prevTags => {
          return prevTags.filter((_, i)=> i != index)
        })
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addCategory,
        onSuccess: (data:Category)=>{
            toast.success(`Brand ${data.name} created successfully`, {
                id: "add-category"
            })

            form.reset({
                name: ""
            })
            setCategory([])
            setSubCategory([])
            successCallback && successCallback(data)

            queryClient.invalidateQueries({queryKey: ["brands"]})

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
                        Create Brand
                    </DialogTitle>
                    <DialogDescription>
                        Brand is used to group products
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className='h-56'>
                    <Form {...form}>
                        <form className='space-y-2'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) =>(
                                    <FormItem className='flex-1 px-3'>
                                        <FormLabel className='text-xs'>Brand name</FormLabel>
                                        <FormControl className='px-1'>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} 
                            />
                            <FormField 
                                name="category"
                                render={({}) =>(
                                    <FormItem className='flex flex-col px-2'>
                                        <FormLabel className='text-xs'>Category</FormLabel>
                                        <FormControl>
                                            <CategoriesPicker removeTag={removeCategoriesTag} tags={category} onChange={handleCategoryChange}/>
                                        </FormControl>
                                        <FormDescription>Select category/(ies)</FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                name="subCategory"
                                render={({}) =>(
                                    <FormItem className='flex flex-col px-2'>
                                        <FormLabel className='text-xs'>Sub Category</FormLabel>
                                        <FormControl>
                                            <SubCategoriesPicker removeTag={removeSubCategoriesTag} tags={subCategory} onChange={handleSubCategoryChange}/>
                                        </FormControl>
                                        <FormDescription>Select sub category/(ies)</FormDescription>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </ScrollArea>
                <DialogFooter >
                    <DialogClose asChild>
                        <Button 
                            type='button'
                            variant={"secondary"}
                            onClick={()=>{
                                form.reset()
                                setCategory([])
                                setSubCategory([])
                            }} >
                                Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                    >
                        {!isPending && "Create Brand"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateBrand
