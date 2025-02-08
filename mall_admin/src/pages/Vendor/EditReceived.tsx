import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form'
import { Button } from '../../components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { EditPackageReceivedSchema, EditReceivedSchemaType} from '@/schema/package'

interface Props{
    trigger?: React.ReactNode,
    id:number,
    trackingNumber:string,
    date:string
}

const EditReceived = ({date, id, trackingNumber, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<EditReceivedSchemaType>({
        resolver:zodResolver(EditPackageReceivedSchema),
        defaultValues:{
            received: new Date()
        }
    })

    const addPackage = async (data:EditReceivedSchemaType)=>{
        const response = await axios_instance_token.patch(`/packages/${id}/received`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addPackage,
        onSuccess: ()=>{
            toast.success("Package updated successfully", {
                id: "edit-package"
            })

            queryClient.invalidateQueries({queryKey: ["package", id]})
            queryClient.invalidateQueries({queryKey: ["packages"]})

            form.reset({
                received: new Date(date)
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

    const onSubmit = (data:EditReceivedSchemaType)=>{
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
                        Edit Package: {trackingNumber}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-1 w-full'>
                        <FormField 
                            control={form.control}
                            name="received"
                            render={({field}) =>(
                                <FormItem className='flex flex-col w-full'>
                                    <FormLabel className='my-1 text-xs'>Received: {new Date(date).toDateString()}</FormLabel>
                                    <Popover >
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button 
                                                variant={'outline'}
                                                className={cn("w-full pl-3 text-xs text-left font-normal", !field.value && 'text-muted-foreground')}>
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className='p-0 w-auto'>
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(value)=>{
                                                    if(!value) return
                                                    field.onChange(value)
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {/* <FormDescription>Select a date for this transaction</FormDescription> */}
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
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                    >
                        {!isPending && "Update Received"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditReceived
