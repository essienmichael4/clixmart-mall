import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { TaxSchema, TaxSchemaType } from '@/schema/tax'

interface Props{
    trigger?: React.ReactNode,
}

const CreateTax = ({trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<TaxSchemaType>({
        resolver:zodResolver(TaxSchema),
        defaultValues:{}
    })

    const addTax = async (data:TaxSchemaType)=>{
        const response = await axios_instance_token.post(`/settings/tax`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addTax,
        onSuccess: ()=>{
            toast.success(`Tax add successfully`, {
                id: "add-tax"
            })

            form.reset({})
            queryClient.invalidateQueries({queryKey: ["tax"]})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "add-tax"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "add-tax"
                })
            }
        }
    })

    const onSubmit = (data:TaxSchemaType)=>{
        toast.loading("Adding tax...", {
            id: "add-tax"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Add Tax
                    </DialogTitle>
                    <DialogDescription>
                        Tax is charged on all products added to the system.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                        <FormField
                            control={form.control}
                            name="taxPercent"
                            render={({field}) =>(
                            <FormItem className='flex-1'>
                                <FormLabel className='text-xs'>Tax Rate</FormLabel>
                                <FormControl className='px-1'>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>Eg: 10 will be converted to 0.1</FormDescription>
                                <FormMessage />
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
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-cyan-500 to-cyan-800 text-white'
                    >
                        {!isPending && "Add Tax"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateTax
