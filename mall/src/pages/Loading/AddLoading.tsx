import { Dialog, DialogTitle, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { CalendarIcon, Loader2 } from 'lucide-react'
import useAxiosToken from '@/hooks/useAxiosToken'
import { useState } from 'react'
import { AddLoadingSchema, AddLoadingSchemaType } from '@/schema/loading'
import StatusPicker from './StatusPicker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'

interface Props{
    trigger?: React.ReactNode,
}

const AddLoading = ({trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<AddLoadingSchemaType>({
        resolver:zodResolver(AddLoadingSchema),
        defaultValues:{
            vessel: "",
            loaded: new Date(),
            eta: new Date(),
            status: "IN_TRANSIT",
        }
    })

    const addAddress = async (data:AddLoadingSchemaType)=>{
        const response = await axios_instance_token.post(`/loadings`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addAddress,
        onSuccess: ()=>{
            toast.success("Container loading added successfully", {
                id: "add-address"
            })

            queryClient.invalidateQueries({queryKey: ["loadings"]})

            form.reset({
                vessel: "",
                loaded: new Date(),
                eta: new Date(),
                status: "IN_TRANSIT",
            })

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "add-address"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "add-address"
                })
            }
        }
    })

    const onSubmit = (data:AddLoadingSchemaType)=>{
        toast.loading("Adding container loading...", {
            id: "add-address"
        })
        mutate(data)
    }

    const handleStatusChange = (value:"IN_TRANSIT" | "ARRIVED" | "DELIVERED")=>{
        form.setValue("status", value)        
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Add Container Loading
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                        <FormField
                            control={form.control}
                            name="vessel"
                            render={({field}) =>(
                                <FormItem className='flex-1'>
                                    <FormLabel className='text-xs'>Vessel</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />

                        <FormField 
                            control={form.control}
                            name="loaded"
                            render={({field}) =>(
                                <FormItem className='flex flex-1 flex-col'>
                                    <FormLabel className='my-1 text-xs'>Loaded</FormLabel>
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

                        <FormField 
                            control={form.control}
                            name="eta"
                            render={({field}) =>(
                                <FormItem className='flex flex-1 flex-col'>
                                    <FormLabel className='my-1 text-xs'>ETA</FormLabel>
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

                        <FormField 
                            control={form.control}
                            name="status"
                            render={({}) =>(
                                <FormItem className='flex flex-col'>
                                <FormLabel className='my-1 text-xs'>Status</FormLabel>
                                <FormControl>
                                    <StatusPicker onChange={handleStatusChange}/>
                                </FormControl>
                                <FormDescription>Select a status</FormDescription>
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
                                form.reset({vessel: "",
                                    loaded: new Date(),
                                    eta: new Date(),
                                    status: "IN_TRANSIT",})
                            }} >
                                Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white py-2'
                    >
                        {!isPending && "Add Loading"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddLoading
