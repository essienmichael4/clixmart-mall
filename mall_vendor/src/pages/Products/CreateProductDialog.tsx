import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { ProductSchema, ProductSchemaType } from '@/schema/product'
// import { Store } from '@/lib/types'
import { useNavigate } from 'react-router-dom'

interface Props{
    trigger?: React.ReactNode,
    store:string
}

const CreateProductDialog = ({store, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<ProductSchemaType>({
        resolver:zodResolver(ProductSchema),
        defaultValues:{
            name: "",
        }
    })

    const addProduct = async (data:ProductSchemaType)=>{
        const response = await axios_instance_token.post(`/products/${store}`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addProduct,
        onSuccess: (data)=>{
            toast.success("Product added successfully", {
                id: "add-product"
            })

            form.reset({
                name: "",
            })

            queryClient.invalidateQueries({queryKey: ["products"]})
            navigate(`/products/${store}/${data.id}/product-info`)
            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "add-product"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "add-product"
                })
            }
        }
    })

    const onSubmit = (data:ProductSchemaType)=>{
        toast.loading("Adding product...", {
            id: "add-product"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Add New Product
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-1'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) =>(
                                <FormItem className='flex-1 px-1'>
                                    <FormLabel className='text-xs'>Product Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
                        {!isPending && "Add Product"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateProductDialog
