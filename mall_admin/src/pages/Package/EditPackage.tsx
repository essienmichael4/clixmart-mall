import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EditPackageSchema, EditPackageSchemaType } from '@/schema/package'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { Package } from '@/lib/types'
import { Textarea } from '@/components/ui/textarea'

interface Props{
    trigger?: React.ReactNode,
    item:Package
}

const EditPackage = ({item, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<EditPackageSchemaType>({
        resolver:zodResolver(EditPackageSchema),
        defaultValues:{
            package: item.package,
            email: item.email,
            phone: item.phone,
            trackingNumber: item.trackingNumber,
            vessel: item.vessel,
            customer: item.customer,
            cbm: Number(item.cbm),
            quantity: Number(item.quantity),
            description: item.description
        }
    })

    const addPackage = async (data:EditPackageSchemaType)=>{
        console.log(data);
        
        const response = await axios_instance_token.patch(`/packages/${item.id}`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addPackage,
        onSuccess: ()=>{
            toast.success("Package editted successfully", {
                id: "edit-package"
            })

            queryClient.invalidateQueries({queryKey: ["package", Number(item.id)]})
            queryClient.invalidateQueries({queryKey: ["packages"]})

            form.reset({
                package: item.package,
                email: item.email,
                phone: item.phone,
                trackingNumber: item.trackingNumber,
                vessel: item.vessel,
                customer: item.customer,
                cbm: Number(item.cbm),
                quantity: Number(item.quantity),
                description: item.description
            })

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

    const onSubmit = (data:EditPackageSchemaType)=>{
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
                        Edit Package: {item.trackingNumber}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-1 h-72 overflow-y-scroll'>
                        <FormField
                            control={form.control}
                            name="trackingNumber"
                            render={({field}) =>(
                                <FormItem className='flex-1 px-1'>
                                    <FormLabel className='text-xs'>Tracking Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />

                        <div className='flex flex-wrap'>
                            <div className='w-full sm:w-1/2 px-1'>
                                <FormField
                                    control={form.control}
                                    name="customer"
                                    render={({field}) =>(
                                        <FormItem className='w-full'>
                                            <FormLabel className='text-xs'>Customer</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />
                            </div>

                            <div className='w-full sm:w-1/2 px-1'>
                                <FormField 
                                    control={form.control}
                                    name="email"
                                    render={({field}) =>(
                                        <FormItem className='w-full'>
                                            <FormLabel className='text-xs'>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />
                            </div>
                            <div className='w-full sm:w-1/2 px-1'>
                                <FormField 
                                    control={form.control}
                                    name="phone"
                                    render={({field}) =>(
                                        <FormItem className='w-full'>
                                            <FormLabel className='text-xs'>Phone</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />
                            </div>
                            <div className='w-full sm:w-1/2 px-1'>
                                <FormField 
                                    control={form.control}
                                    name="cbm"
                                    render={({field}) =>(
                                        <FormItem className='w-full'>
                                            <FormLabel className='text-xs'>CBM</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />
                            </div>
                            <div className='w-full sm:w-1/2 px-1'>
                                <FormField 
                                    control={form.control}
                                    name="quantity"
                                    render={({field}) =>(
                                        <FormItem className='w-full'>
                                            <FormLabel className='text-xs'>Quantity</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />
                            </div>
                            <div className='w-full sm:w-1/2 px-1'>
                                <FormField 
                                    control={form.control}
                                    name="package"
                                    render={({field}) =>(
                                        <FormItem className='w-full'>
                                            <FormLabel className='text-xs'>Package</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />
                            </div>
                            <div className='w-full sm:w-1/2 px-1'>
                                <FormField 
                                    control={form.control}
                                    name="vessel"
                                    render={({field}) =>(
                                        <FormItem className='w-full'>
                                            <FormLabel className='text-xs'>Vessel Line</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />
                            </div>
                        </div>

                        <FormField 
                            control={form.control}
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
                                    package: item.package,
                                    email: item.email,
                                    phone: item.phone,
                                    trackingNumber: item.trackingNumber,
                                    vessel: item.vessel,
                                    customer: item.customer,
                                    cbm: Number(item.cbm),
                                    quantity: Number(item.quantity),
                                    description: item.description
                                })
                            }} >
                                Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                    >
                        {!isPending && "Edit Package"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditPackage
